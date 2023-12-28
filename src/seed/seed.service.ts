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
      'https://pokeapi.co/api/v2/pokemon?limit=150',
    );

    const pokemonData = await Promise.all(
      data.results.map(async ({ name, url }) => {
        const segment = url.split('/');
        const no = +segment[segment.length - 2];

        const typeDetailUrl = `https://pokeapi.co/api/v2/pokemon/${name}/`;
        const typeDetails = await this.http.get<any>(typeDetailUrl);

        const typeNames = typeDetails.types.map((slot) => slot.type.name);

        const formImageUrl = typeDetails.sprites?.front_default;

        return {
          name,
          no,
          image_url: formImageUrl,
          types: typeNames,
        };
      }),
    );

    await this.pokemonModel.create(pokemonData);

    return data.results;
  }
}
