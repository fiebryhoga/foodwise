import FoodWiseApp from '@/components/food-wise/main-app';

export default function Home() {
  return (
    <div className="flex w-full flex-col items-center bg-background p-4 sm:p-8 md:p-12">
      <FoodWiseApp />
    </div>
  );
}
