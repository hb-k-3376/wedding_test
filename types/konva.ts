import type { KonvaEventObject } from 'konva/lib/Node';

export type ItemType = 'text' | 'image';

export interface BaseItem {
  id: string;
  type: ItemType;
  x: number;
  y: number;
}

export interface TextItem extends BaseItem {
  type: 'text';
  text: string;
  fontSize: number;
}

export interface ImageItem extends BaseItem {
  type: 'image';
  width: number;
  height: number;
  src: string;
}

export type Item = TextItem | ImageItem;

// 드래그 이벤트 타입
export type DragEndHandler = (id: string, pos: { x: number; y: number }) => void;

// 변환(크기/텍스트) 업데이트 타입
export type TransformHandler = (id: string, newAttrs: Partial<Item>) => void;

// Konva 이벤트 타입
export type KonvaDragEvent = KonvaEventObject<DragEvent>;
