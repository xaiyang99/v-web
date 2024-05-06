import { InputBase, styled } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Search as SearchIcon } from "react-feather";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const Search = styled("div")(({ theme }) => ({
  borderRadius: "2px",
  backgroundColor: theme.header.background,
  display: "none",
  position: "relative",
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    display: "block",
  },
  [theme.breakpoints.between("width599", "width642")]: {
    display: "none",
  },
}));

const SearchIconWrapper = styled("div")({
  width: "50px",
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  svg: {
    width: "22px",
    height: "22px",
  },
});

const Input = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  border: "1px solid #ececec",
  borderRadius: "2px",

  input: {
    color: theme.header.search.color,
    paddingTop: theme.spacing(1),
    paddingRight: theme.spacing(2.5),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(6),
    width: "100%",
  },
}));

function InputSearch(props) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const inputRef = useRef(null);

  // const [inputSearch, setInputSearch] = useState(null);
  const { inputSearch, setInputSearch, setInputHover, onChange, onEnter } =
    props.data;

  const [value, setValue] = useState(inputSearch);

  const handleOnChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  const handleOnEnterKey = (e) => {
    if (e?.keyCode === 13 && inputSearch) {
      onEnter();
      inputRef.current.blur();
      setInputHover(false);
    }
  };

  useEffect(() => {
    if (/\/search\/.*/i.test(location.pathname)) {
      if (params?.name) {
        setValue(params?.name);
        onChange(params?.name);
      }
    }
  }, [params]);

  const onMouseOver = () => {
    setInputHover(true);
  };

  // const onMouseOut = () => {
  //   setInputHover(false);
  // };
  return (
    <div>
      <Search>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <Input
          inputRef={inputRef}
          placeholder={t("Search")}
          type="text"
          value={value || ""}
          onFocus={(e) => {
            setInputHover(true);
            handleOnChange(e);
          }}
          onChange={(e) => {
            if (e.target.value) {
              setInputHover(true);
            }
            handleOnChange(e);
          }}
          onKeyUp={(e) => handleOnEnterKey(e)}
          onMouseDown={onMouseOver}
          // onMouseOut={onMouseOut}
        />
      </Search>
    </div>
  );
}

export default InputSearch;
