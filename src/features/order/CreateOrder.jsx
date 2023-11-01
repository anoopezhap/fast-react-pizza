import { useState } from "react";
import { Form, redirect, useActionData, useNavigation } from "react-router-dom";
import { createOrder } from "../../services/apiRestaurant";
import Button from "../../ui/Button";
import { useDispatch, useSelector } from "react-redux";
import { clearCart, getCart, getTotalCartPrice } from "../cart/cartSlice";
import EmptyCart from "../cart/EmptyCart";
import store from "../../store";
import { formatCurrency } from "../../utils/helpers";
import { fetchAddress } from "../user/userSlice";

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str,
  );

function CreateOrder() {
  //navigation state can be idle/loading or submitting
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const [withPriority, setWithPriority] = useState(false);

  //to access the errors returned from the actions
  const formErrors = useActionData();

  const {
    userName,
    status: addressStatus,
    position,
    address,
  } = useSelector((store) => store.user);

  const isLoadingAddress = addressStatus === "loading";

  const totalCartPrice = useSelector(getTotalCartPrice);
  const priorityPrice = withPriority ? totalCartPrice * 0.2 : 0;

  const totalPrice = totalCartPrice + priorityPrice;
  const dispatch = useDispatch();

  const cart = useSelector(getCart);

  if (!cart.length) return <EmptyCart />;

  return (
    <div className="px-4 py-6">
      <h2 className="mb-8 text-xl font-semibold">Ready to order? Lets go!</h2>

      {/* //form can handle patch and put and delete request */}

      <Form method="POST" action="/order/new">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">First Name</label>
          <input
            type="text"
            name="customer"
            required
            className="input grow"
            defaultValue={userName}
          />
        </div>

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">Phone number</label>
          <div className="grow">
            <input type="tel" name="phone" required className="input w-full" />
            {formErrors?.phone && (
              <p className="mt-2 rounded-full bg-red-100 p-2 text-xs text-red-700">
                {formErrors.phone}
              </p>
            )}
          </div>
        </div>

        <div className="relative mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">Address</label>
          <div className="grow">
            <input
              type="text"
              name="address"
              required
              className="input w-full"
              disabled={isLoadingAddress}
              defaultValue={address}
            />
          </div>
          <span className="absolute right-[3px] z-50">
            {
              <Button
                type="small"
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(fetchAddress());
                }}
                disabled={isLoadingAddress}
              >
                Get Location
              </Button>
            }
          </span>
        </div>

        <div className="mb-5 flex  gap-2 sm:flex-row sm:items-center">
          <input
            type="checkbox"
            name="priority"
            id="priority"
            className="h-6 w-6 accent-yellow-400 focus:outline-none focus:ring focus:ring-yellow-400 focus:ring-offset-2"
            value={withPriority}
            onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label htmlFor="priority">Want to yo give your order priority?</label>
        </div>

        <div>
          {/* //this is hidden here, but will be available in the form data */}

          <input type="hidden" name="cart" value={JSON.stringify(cart)} />

          <Button type="primary" disabled={isSubmitting}>
            {isSubmitting
              ? "Placing Order"
              : `Order now for ${formatCurrency(totalPrice)}`}
          </Button>
        </div>
      </Form>
    </div>
  );
}

//wheneever form is ubmitted action funciton is called with the request

export async function action({ request }) {
  const formData = await request.formData();

  //to convert form data in a nice visible object
  const data = Object.fromEntries(formData);

  const order = {
    ...data,
    cart: JSON.parse(data.cart),
    priority: data.priority === "true",
  };

  const errors = {};

  //creating an error
  if (!isValidPhone(order.phone))
    errors.phone = "Please enter a valid phone number";

  //return the errors object, is the object have atleast one key
  if (Object.keys(errors).length > 0) return errors;

  const newOrder = await createOrder(order);

  //hack to clear cart
  store.dispatch(clearCart());

  //we cannot use navigate here. Navigate can be only used inside hooks. So se use redirect

  return redirect(`/order/${newOrder.id}`);
}

export default CreateOrder;
