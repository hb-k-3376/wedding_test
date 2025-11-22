/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Text, Image as KonvaImage, Transformer } from 'react-konva';
import { useImage } from '@/utils/useImage';

interface Item {
  id: string;
  type: 'text' | 'image';
  x: number;
  y: number;
  width?: number;
  height?: number;
  text?: string;
  fontSize?: number;
  src?: string;
}

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const addText = () => {
    setItems((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        type: 'text',
        x: 50,
        y: 50,
        text: '안녕하세요',
        fontSize: 24,
      },
    ]);
  };

  const addImage = () => {
    setItems((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        type: 'image',
        x: 100,
        y: 100,
        width: 150,
        height: 150,
        src: '/sample.jpeg',
      },
    ]);
  };

  const handleDrag = (id: string, pos: { x: number; y: number }) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, x: pos.x, y: pos.y } : item))
    );
  };

  const handleTransform = (id: string, newAttrs: Partial<Item>) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...newAttrs } : item))
    );
  };

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <button onClick={addText}>텍스트 추가</button>
        <button onClick={addImage}>이미지 추가</button>
      </div>

      <Stage width={400} height={600} style={{ border: '1px solid #ddd' }}>
        <Layer>
          {items.map((item) => {
            if (item.type === 'text') {
              return (
                <EditableText
                  key={item.id}
                  item={item}
                  isSelected={item.id === selectedId}
                  onSelect={() => setSelectedId(item.id)}
                  onDrag={handleDrag}
                  onTransform={handleTransform}
                />
              );
            }

            if (item.type === 'image') {
              return (
                <EditableImage
                  key={item.id}
                  item={item}
                  isSelected={item.id === selectedId}
                  onSelect={() => setSelectedId(item.id)}
                  onDrag={handleDrag}
                  onTransform={handleTransform}
                />
              );
            }

            return null;
          })}
        </Layer>
      </Stage>
    </div>
  );
}

// ---------------- Editable Image ----------------
interface EditableImageProps {
  item: Item;
  isSelected: boolean;
  onSelect: () => void;
  onDrag: (id: string, pos: { x: number; y: number }) => void;
  onTransform: (id: string, newAttrs: Partial<Item>) => void;
}

function EditableImage({
  item,
  isSelected,
  onSelect,
  onDrag,
  onTransform,
}: EditableImageProps) {
  const shapeRef = useRef<any>(null);
  const trRef = useRef<any>(null);
  const img = useImage(item.src || '');

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  if (!img) return null;

  return (
    <>
      <KonvaImage
        ref={shapeRef}
        image={img}
        x={item.x}
        y={item.y}
        width={item.width}
        height={item.height}
        draggable
        onClick={onSelect}
        onDragEnd={(e) => onDrag(item.id, { x: e.target.x(), y: e.target.y() })}
        onTransformEnd={(e) => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          onTransform(item.id, {
            x: node.x(),
            y: node.y(),
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(5, node.height() * scaleY),
          });

          node.scaleX(1);
          node.scaleY(1);
        }}
      />
      {isSelected && <Transformer ref={trRef} />}
    </>
  );
}

// ---------------- Editable Text ----------------
interface EditableTextProps {
  item: Item;
  isSelected: boolean;
  onSelect: () => void;
  onDrag: (id: string, pos: { x: number; y: number }) => void;
  onTransform: (id: string, newAttrs: Partial<Item>) => void;
}

function EditableText({
  item,
  isSelected,
  onSelect,
  onDrag,
  onTransform,
}: EditableTextProps) {
  const shapeRef = useRef<any>(null);
  const trRef = useRef<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(item.text || '');

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    onTransform(item.id, { text });
  };

  return (
    <>
      <Text
        ref={shapeRef}
        text={text}
        x={item.x}
        y={item.y}
        fontSize={item.fontSize}
        draggable
        onClick={onSelect}
        onDragEnd={(e) => onDrag(item.id, { x: e.target.x(), y: e.target.y() })}
        onDblClick={handleDoubleClick}
      />
      {isSelected && !isEditing && <Transformer ref={trRef} />}
      {isEditing && (
        <textarea
          style={{
            position: 'absolute',
            top: item.y,
            left: item.x,
            fontSize: item.fontSize,
            color: '#000',
          }}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={handleBlur}
          autoFocus
        />
      )}
    </>
  );
}
