import "./paginationStyled.css";

import ResponsivePagination from "react-responsive-pagination";

const PaginationStyled = (props) => {
  return (
    <div className="pagination-styled">
      <ResponsivePagination
        current={props.currentPage}
        total={props.total}
        onPageChange={props.setCurrentPage}
        previousLabel="Previous"
        nextLabel="Next"
      />
    </div>
  );
};

export default PaginationStyled;
