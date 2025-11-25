import CanvasStage from '@/components/CanvasStage';
import DraggableImageList from '@/components/DraggableImageList';

export default function Page() {
  return (
    <div className="flex gap-6 p-6">
      <DraggableImageList images={['/sample.jpeg', '/sample2.jpeg']} />
      <CanvasStage />
    </div>
  );
}
