import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PokeResponse } from './interfaces/poke-response.interface';
import { PokemonService } from 'src/pokemon/pokemon.service';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {
  constructor(
    private readonly http: AxiosAdapter,
    private readonly pokemonService: PokemonService,
    @InjectModel('Pokemon') private readonly pokemonModel: Model<any>,
  ) {}

  async executeSeed() {
    await this.pokemonModel.deleteMany({});
    const data = await this.http.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=650',
    );
    const pokemonToInsert: { name: string; no: number }[] = [];
    data.results.map(({ name, url }) => {
      const segment = url.split('/');
      const no = +segment[segment.length - 2];
      pokemonToInsert.push({ name, no });
    });

    try {
      await this.pokemonModel.insertMany(pokemonToInsert);
      return 'Seed Executed';
    } catch (error) {
      this.pokemonService.handleExceptions(error);
    }
  }
}
