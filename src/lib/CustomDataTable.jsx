import React from "react";
import DataTable from "react-data-table-component";

export default function CustomDataTable({ data, columns, page, setPage, perPage, setPerPage }) {
    // Custom styles for header
    const customStyles = {
      head: {
        style: {
          background: "blue", // Background color for header
          color: "black", // Text color for header
          fontWeight: "700",
          fontSize: "14px", // Set font size for header
        },
      },
    };

  const handlePageChange = (page) => {
    setPage(page);
  };

  const handlePerPageChange = (newPerPage) => {
    setPerPage(newPerPage);
    setPage(1); // Per page o'zgarganda 1-betga qaytish
  };

  return (
    <div>
      <DataTable
        columns={columns}
        data={data}
        fixedHeader
        pagination
        paginationPerPage={perPage}
        paginationRowsPerPageOptions={[10, 15, 20]} // Per page opsiyalari
        paginationTotalRows={data.length > 0 ? data.length : 1} // Pagination uchun umumiy satrlar
        onChangePage={handlePageChange} // Page o'zgarishini ushlash
        onChangeRowsPerPage={handlePerPageChange} // Per page o'zgarishini ushlash
        highlightOnHover // Hover qilinganda satrni belgilash
        customStyles={customStyles} // Maxsus stylelar
      />
    </div>
  );
}