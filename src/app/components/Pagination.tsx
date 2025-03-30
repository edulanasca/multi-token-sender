import { ButtonGroup, IconButton } from "@chakra-ui/react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPrevPage: () => void;
  onNextPage: () => void;
}

export const Pagination = ({ page, totalPages, onPrevPage, onNextPage }: PaginationProps) => (
  <ButtonGroup size="sm">
    <IconButton onClick={onPrevPage} disabled={page <= 1}>
      <LuChevronLeft/>
    </IconButton>
    <IconButton>
      {page} / {totalPages}
    </IconButton>
    <IconButton onClick={onNextPage} disabled={page >= totalPages}>
      <LuChevronRight />
    </IconButton>
  </ButtonGroup>
); 