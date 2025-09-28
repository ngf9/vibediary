export default function StatsBox() {
  return (
    <div className="max-w-3xl mx-auto mb-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
        <div className="relative">
          <p className="text-5xl lg:text-6xl font-bold mb-2 text-blue">150+</p>
          <p className="text-base lg:text-lg text-gray-600">students (primarily YC founders)</p>
        </div>
        <div className="relative">
          <p className="text-5xl lg:text-6xl font-bold mb-2 text-blue">100%</p>
          <p className="text-base lg:text-lg text-gray-600">Completion Rate</p>
        </div>
      </div>
    </div>
  );
}