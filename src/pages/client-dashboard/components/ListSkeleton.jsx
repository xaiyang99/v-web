import { Skeleton } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";

function ListSkeleton() {
  const columSkeleton = Array.from({ length: 4 });
  const rowsSkeleton = Array.from({ length: 6 });

  return (
    <div>
      <Skeleton width={100} height={30} sx={{ mb: 3, mt: 5 }} />
      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableBody>
            {rowsSkeleton?.map((_, index) => {
              return (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  {columSkeleton?.map((_, index) => (
                    <TableCell key={index}>
                      <Skeleton width="80%" height={10} />
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default ListSkeleton;
