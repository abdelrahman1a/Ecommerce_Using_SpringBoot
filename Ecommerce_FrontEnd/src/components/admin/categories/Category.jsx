import React, { useState } from "react";
import { adminCategoryTableColumn } from "../../helper/tableColumn";
import { useDispatch, useSelector } from "react-redux";
import { MdAddShoppingCart } from "react-icons/md";
import { FaBoxOpen } from "react-icons/fa";
import { DataGrid } from "@mui/x-data-grid";
import AddCategoryForm from "./AddCategoryForm";
import Modal from "../../shared/Modal";
import DeleteModal from "../../shared/DeleteModal";
import Loader from "../../shared/Loader";
import ProductViewModal from "../../shared/ProductViewModal";
import useCategoryFilter from "../../../hooks/useCategoryFilter";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import toast from "react-hot-toast";
import { deleteCategory } from "../../../store/actions";

const Categories = () => {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [loader, setLoader] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const dispatch = useDispatch();
  const { isLoading, errorMessage } = useSelector((state) => state.errors);
  const { categories, pagination } = useSelector((state) => state.products);

  const [currentPage, setCurrentPage] = useState(
    pagination?.pageNumber + 1 || 1,
  );
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const pathname = useLocation().pathname;

  const emptyCategories = !categories || categories?.length == 0;

  useCategoryFilter();

  const handleEdit = (category) => {
    setOpenUpdateModal(true);
    setSelectedCategory(category);
  };

  const handleDelete = (category) => {
    setOpenDeleteModal(true);
    setSelectedCategory(category);
  };
  const handlePaginationChange = (paginationModel) => {
    const page = paginationModel.page + 1;
    setCurrentPage(page);
    params.set("page", page.toString());
    navigate(`${pathname}?${params}`);
  };

  const onDeleteHandler = () => {
    dispatch(
      deleteCategory(
        setLoader,
        selectedCategory?.id,
        toast,
        setOpenDeleteModal,
      ),
    );
  };
  const tableRecords = categories?.map((category) => {
    return {
      id: category.id,
      categoryName: category.categoryName,
    };
  });
  return (
    <div>
      <div className="pt-6 pb-10 flex justify-end">
        <button
          onClick={() => {
            setOpenAddModal(true);
          }}
          className="bg-custom-blue hover:bg-blue-600 text-white font-semibold py-2 px-4 flex items-center gap-2 rounded-md cursor-pointer shadow-md transition-colors hover:text-slate-300 duration-300"
        >
          <MdAddShoppingCart className="text-xl" />
          Add Category
        </button>
      </div>
      {!emptyCategories && (
        <h1 className="text-slate-800 text-3xl text-center font-bold pb-6 uppercase">
          All Categories
        </h1>
      )}
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {emptyCategories ? (
            <div className="flex flex-col items-center justify-center text-gray-600 py-10">
              <FaBoxOpen size={50} className="mb-3" />
              <h2 className="text-2xl font-semibold">
                No Categories created yet.
              </h2>
            </div>
          ) : (
            <div className="max-w-5xl mx-auto">
              <DataGrid
                className="w-full"
                rows={tableRecords}
                columns={adminCategoryTableColumn(handleEdit, handleDelete)}
                paginationMode="server"
                rowCount={pagination?.totalElements || 0}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: pagination?.pageSize || 10,
                      page: currentPage - 1,
                    },
                  },
                }}
                onPaginationModelChange={handlePaginationChange}
                disableRowSelectionOnClick
                disableColumnResize
                pageSizeOptions={[pagination?.pageSize || 10]}
                pagination
                paginationOptions={{
                  showFirstButton: true,
                  showLastButton: true,
                  hideNextButton: currentPage === pagination?.totalPages,
                }}
              />
            </div>
          )}
        </>
      )}
      <Modal
        open={openUpdateModal || openAddModal}
        setOpen={openUpdateModal ? setOpenUpdateModal : setOpenAddModal}
        title={openUpdateModal ? "Update Category" : "Add Category"}
      >
        <AddCategoryForm
          setOpen={openUpdateModal ? setOpenUpdateModal : setOpenAddModal}
          category={selectedCategory}
          update={openUpdateModal}
        />
      </Modal>

      <DeleteModal
        open={openDeleteModal}
        setOpen={setOpenDeleteModal}
        loader={loader}
        title={"Are you Sure you Want to Delete"}
        onDeleteHandler={onDeleteHandler}
      />
      {/* <ProductViewModal
        open={openProductViewModal}
        setOpen={setOpenProductViewModal}
        product={selectedProduct}
      /> */}
    </div>
  );
};

export default Categories;
