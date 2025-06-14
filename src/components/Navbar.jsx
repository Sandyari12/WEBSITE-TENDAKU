import { Link } from 'react-router-dom'

function Navbar({ cartCount }) {
  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            CampingGear
          </Link>
          
          <div className="flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600">
              Beranda
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-blue-600">
              Peralatan
            </Link>
            <Link to="/cart" className="text-gray-700 hover:text-blue-600">
              Keranjang
              {cartCount > 0 && (
                <span className="ml-1 bg-blue-600 text-white rounded-full px-2 py-0.5 text-xs">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link to="/admin" className="text-gray-700 hover:text-blue-600">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar 