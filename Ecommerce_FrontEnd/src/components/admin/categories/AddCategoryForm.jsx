import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Spinners from "../../shared/Spinners";
import { Button } from "@mui/material";
import SelectTextField from "../../shared/SelectTextField";
import InputField from "../../shared/InputField";
import {
  addNewCategoryFromDashboard,
  updateCategoryFromDashboard,
} from "../../../store/actions";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

const AddCategoryForm = ({ setOpen, category, update }) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({ mode: "onTouched" });
  const dispatch = useDispatch();

  useEffect(() => {
    if (update && category) {
      setValue("categoryName", category?.categoryName);
    }
  }, [update, category]);
  const [loader, setLoader] = useState(false);
  const saveProductHandler = (data) => {
    if (!update) {
      // create new product

      dispatch(
        addNewCategoryFromDashboard(data, toast, reset, setLoader, setOpen),
      );
    } else {
      const sendData = {
        ...data,
        categoryId: category.id,
      };
      console.log(sendData);

      dispatch(
        updateCategoryFromDashboard(sendData, toast, reset, setLoader, setOpen),
      );
    }
  };
  return (
    <div className="py-5 relative h-full">
      <form className="space-y-4" onSubmit={handleSubmit(saveProductHandler)}>
        {update ? (
          <div className="flex md:flex-row flex-col gap-4 w-full">
            <InputField
              label="Category Name"
              required
              id="categoryName"
              type="text"
              message="This field is required*"
              register={register}
              placeholder="Category Name"
              errors={errors}
              value={category.categoryName}
            />
          </div>
        ) : (
          <div className="flex md:flex-row flex-col gap-4 w-full">
            <InputField
              label="Category Name"
              required
              id="categoryName"
              type="text"
              message="This field is required*"
              register={register}
              placeholder="Category Name"
              errors={errors}
            />
          </div>
        )}

        <div className="flex w-full justify-between items-center absolute bottom-14">
          <Button
            disabled={loader}
            onClick={() => setOpen(false)}
            variant="outlined"
            className="text-white py-[10px] px-4 text-sm font-medium"
          >
            Cancel
          </Button>

          <Button
            disabled={loader}
            type="submit"
            variant="contained"
            color="primary"
            className="bg-custom-blue text-white  py-[10px] px-4 text-sm font-medium"
          >
            {loader ? (
              <div className="flex gap-2 items-center">
                <Spinners /> Loading...
              </div>
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddCategoryForm;
