import Address from "@/components/shopping-view/address";
import img from "../../assets/account.jpg";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { createNewOrder } from "@/store/shop/order-slice";
import { useToast } from "@/components/ui/use-toast";
import { PayPalButtons } from "@paypal/react-paypal-js";

function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isPaymentStart, setIsPaymemntStart] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash-on-delivery");
  const dispatch = useDispatch();
  const { toast } = useToast();

  const totalCartAmount =
    cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  const handleCODPayment = () => {
    const orderData = {
      userId: user?.id,
      cartId: cartItems?._id,
      cartItems: cartItems.items.map((singleCartItem) => ({
        productId: singleCartItem?.productId,
        title: singleCartItem?.title,
        image: singleCartItem?.image,
        price:
          singleCartItem?.salePrice > 0
            ? singleCartItem?.salePrice
            : singleCartItem?.price,
        quantity: singleCartItem?.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        pincode: currentSelectedAddress?.pincode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
      },
      orderStatus: "pending",
      paymentMethod,
      paymentStatus: "pending",
      totalAmount: totalCartAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: "",
      payerId: "",
    };

    setIsPaymemntStart(true);

    dispatch(createNewOrder(orderData)).then((data) => {
      setIsPaymemntStart(false);
      if (!data?.payload?.success) {
        toast({
          title: "Order creation failed. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Order placed successfully!",
          variant: "default",
        });
      }
    });
  };

  const isFormReady = () => {
    if (!cartItems || cartItems.length === 0) {
      toast({
        title: "Your cart is empty. Please add items to proceed.",
        variant: "destructive",
      });
      return false;
    }

    if (currentSelectedAddress === null) {
      toast({
        title: "Please select an address to proceed.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  return (
    <div className="flex flex-col">
      <div className="relative h-[300px] w-full overflow-hidden">
        <img src={img} className="h-full w-full object-cover object-center" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
        <Address
          selectedId={currentSelectedAddress}
          setCurrentSelectedAddress={setCurrentSelectedAddress}
        />
        <div className="flex flex-col gap-4">
          {cartItems && cartItems.items && cartItems.items.length > 0
            ? cartItems.items.map((item) => (
                <UserCartItemsContent key={item.productId} cartItem={item} />
              ))
            : null}

          <div className="mt-4">
            <label className="block mb-2 font-medium">Select Payment Method:</label>
            <select
              className="w-full p-2 border border-gray-300 rounded"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="cash-on-delivery">Cash on Delivery</option>
              <option value="paypal">PayPal</option>
            </select>
          </div>

          <div className="mt-8 space-y-4">
            <div className="flex justify-between">
              <span className="font-bold">Total</span>
              <span className="font-bold">
                ₹{totalCartAmount.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          <div className="mt-4 w-full">
            {paymentMethod === "paypal" && isFormReady() ? (
              <PayPalButtons
                style={{ layout: "vertical" }}
                createOrder={(data, actions) => {
                  return actions.order.create({
                    purchase_units: [
                      {
                        amount: {
                          value: totalCartAmount.toFixed(2),
                          currency_code: "INR", // Or "INR" if supported and PayPal business account allows
                        },
                      },
                    ],
                  });
                }}
                onApprove={(data, actions) => {
                  return actions.order.capture().then((details) => {
                    const { id, payer } = details;
                    const orderData = {
                      userId: user?.id,
                      cartId: cartItems?._id,
                      cartItems: cartItems.items.map((singleCartItem) => ({
                        productId: singleCartItem?.productId,
                        title: singleCartItem?.title,
                        image: singleCartItem?.image,
                        price:
                          singleCartItem?.salePrice > 0
                            ? singleCartItem?.salePrice
                            : singleCartItem?.price,
                        quantity: singleCartItem?.quantity,
                      })),
                      addressInfo: {
                        addressId: currentSelectedAddress?._id,
                        address: currentSelectedAddress?.address,
                        city: currentSelectedAddress?.city,
                        pincode: currentSelectedAddress?.pincode,
                        phone: currentSelectedAddress?.phone,
                        notes: currentSelectedAddress?.notes,
                      },
                      orderStatus: "confirmed",
                      paymentMethod,
                      paymentStatus: "paid",
                      totalAmount: totalCartAmount,
                      orderDate: new Date(),
                      orderUpdateDate: new Date(),
                      paymentId: id,
                      payerId: payer?.payer_id,
                    };

                    dispatch(createNewOrder(orderData));
                    toast({
                      title: "Payment successful!",
                    });
                  });
                }}
                onError={(err) => {
                  toast({
                    title: "PayPal payment failed.",
                    description: err.message || "Something went wrong.",
                    variant: "destructive",
                  });
                }}
              />
            ) : (
              <Button
                onClick={() => {
                  if (isFormReady()) handleCODPayment();
                }}
                className="w-full"
              >
                {isPaymentStart
                  ? "Processing Payment..."
                  : "Checkout (Cash on Delivery)"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;
