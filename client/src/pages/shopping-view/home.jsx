// Imports
import { Button } from "@/components/ui/button";  //it is a user interface element that triggers an action when clicked
import bannerOne from "../../assets/slide-1.jpg";
import bannerTwo from "../../assets/slide-2.jpg";
import bannerThree from "../../assets/slide-3.jpg";
import TilesCalculator from "@/components/shopping-view/TilesCalculator";
import kitchenImage from "../../assets/kitchen.jpg";
import bathroomImage from "../../assets/bathroom.jpg";
import parkingImage from "../../assets/parking.jpg";
import flooringImage from "../../assets/flooring.jpg";
import washareaImage from "../../assets/washarea.jpg";

import kajariaIcon from "../../assets/kajaria.jpg";
import simpolloIcon from "../../assets/simpolo.jpeg";
import ceraIcon from "../../assets/cera.png";
import aglIcon from "../../assets/AGL.png";
import johnsonIcon from "../../assets/Johnson.jpg";
import bajajIcon from "../../assets/Bajaj.webp";

import { Card, CardContent } from "@/components/ui/card"; 
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";  //connects react with redux which is a state management tool manages global state outside of components like user data, app setting
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";

// Categories with images
const categoriesWithImage = [
  { id: "Kitchen", label: "Kitchen", image: kitchenImage },
  { id: "Bathroom", label: "Bathroom", image: bathroomImage },
  { id: "Parking", label: "Parking", image: parkingImage },
  { id: "Flooring", label: "Flooring", image: flooringImage },
  { id: "Washarea", label: "Washarea", image: washareaImage },
];

// Brands with image icons
const brandsWithIcon = [
  { id: "Kajaria", label: "Kajaria", icon: kajariaIcon },
  { id: "Johnson", label: "Johnson", icon: johnsonIcon },
  { id: "Simpolo", label: "Simpolo", icon: simpolloIcon },
  { id: "Bajaj Tiles", label: "Bajaj Tiles", icon: bajajIcon },
  { id: "AGL", label: "AGL", icon: aglIcon },
  { id: "CERA", label: "CERA", icon: ceraIcon },
];

function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const localBannerImages = [bannerOne, bannerTwo, bannerThree];

  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  function handleNavigateToListingPage(getCurrentItem, section) {
    if (getCurrentItem.isCalculator) {
      document.getElementById("tile-calculator-section")?.scrollIntoView({
        behavior: "smooth",
      });
      return;
    }

    sessionStorage.removeItem("filters");
    const currentFilter = {
      [section]: [getCurrentItem.id],
    };
    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/shop/listing`);
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddtoCart(getCurrentProductId) {
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product is added to cart",
        });
      }
    });
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(
        (prevSlide) => (prevSlide + 1) % localBannerImages.length
      );
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Banner Carousel */}
      <div className="relative w-full h-[600px] overflow-hidden">
        {localBannerImages.map((img, index) => (
          <img
            src={img}
            key={index}
            className={`${
              index === currentSlide ? "opacity-100" : "opacity-0"
            } absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000`}
            alt={`Slide ${index + 1}`}
          />
        ))}
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) =>
                (prevSlide - 1 + localBannerImages.length) %
                localBannerImages.length
            )
          }
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) => (prevSlide + 1) % localBannerImages.length
            )
          }
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </Button>
      </div>

      {/* Category Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categoriesWithImage.map((categoryItem) => (
              <Card
                key={categoryItem.id}
                onClick={() =>
                  handleNavigateToListingPage(categoryItem, "category")
                }
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <img
                    src={categoryItem.image}
                    alt={categoryItem.label}
                    className="w-full h-40 object-cover mb-4"
                  />
                  <span className="font-bold text-center">
                    {categoryItem.label}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Shop by Brand
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {brandsWithIcon.map((brandItem) => (
              <Card
                key={brandItem.id}
                onClick={() => handleNavigateToListingPage(brandItem, "brand")}
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <img
                    src={brandItem.icon}
                    alt={brandItem.label}
                    className="w-full h-16 object-contain mb-4"
                  />
                  <span className="font-bold text-center">
                    {brandItem.label}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Featured Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productList &&
              productList.length > 0 &&
              productList.map((productItem) => (
                <ShoppingProductTile
                  key={productItem.id}
                  handleGetProductDetails={handleGetProductDetails}
                  product={productItem}
                  handleAddtoCart={handleAddtoCart}
                />
              ))}
          </div>
        </div>
      </section>

      {/* Tiles Calculator Section */}
      <section id="tile-calculator-section" className="py-12 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Tiles Calculator
          </h2>
          <TilesCalculator />
        </div>
      </section>

      {/* Product Details Dialog */}
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingHome;
