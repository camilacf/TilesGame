import { Tile } from 'src/app/services/tiles.service';

export interface Board {
  playerId: number;
  buildingLines: BuildingLine[];
  contructedLines: ConstructedLine[];
  brokenLine: BrokenSpace[];
}

export interface BuildingLine {
  spaceQuantity: number;
  tiles: Tile[];
}

export interface ConstructedLine {
  spaces: { color: string; column: number }[];
  tiles: { tile: Tile; column: number }[];
  index: number;
}

export interface BrokenSpace {
  tile?: Tile;
  pointLoss: number;
}
