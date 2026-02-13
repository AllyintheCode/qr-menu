export default function MenuCard({ product }) {
  return (
    <div className="bg-white rounded-xl shadow">
      <img
        src={product.image}
        className="h-32 w-full object-cover rounded-t-xl"
      />

      <div className="p-2">
        <h3 className="font-semibold text-sm">{product.name}</h3>
        <p className="text-xs text-gray-500">{product.ingredients}</p>

        {product.discountPrice ? (
          <div className="flex gap-1 text-sm">
            <span className="line-through text-gray-400">{product.price}₼</span>
            <span className="text-red-500 font-bold">
              {product.discountPrice}₼
            </span>
          </div>
        ) : (
          <span className="font-bold text-sm">{product.price}₼</span>
        )}
      </div>
    </div>
  );
}
