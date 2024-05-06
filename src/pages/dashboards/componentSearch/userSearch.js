import { useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import Select from "react-select";
import { QUERY_USER_SEARCH } from "./apollo";

export default function SelectUsers({
  className,
  style,
  onChange,
  disabled,
  value,
}) {
  const [items, setItems] = useState([]);
  const [selectedOption, setSelectedOption] = useState({
    label: "User name",
    value: "User name",
  });
  const [getValueInput, setGetValueInput] = useState(null);
  const [fetchData, { data, loading }] = useLazyQuery(QUERY_USER_SEARCH);
  useEffect(() => {
    fetchData({
      variables: {
        where: {
          firstName: getValueInput ? String(getValueInput) : undefined,
        },
        limit: 5,
      },
    });
  }, [getValueInput]);
  useEffect(() => {
    const results = data?.getUser?.data || [];
    if (results?.length > 0) {
      const _results = results.map((item) => {
        const object = {
          ...item,
          value: item?._id,
          label: item?.firstName + " " + item?.lastName,
        };
        return object;
      });
      setItems([{ label: "User name", value: "User name" }, ..._results]);
    } else {
      setItems([]);
    }
  }, [data]);
  useEffect(() => {
    if (!selectedOption) {
      if (value) {
        const result = items?.filter((item) => item?._id === value);
        setSelectedOption(result[0] || null);
      } else {
        setSelectedOption(null);
      }
    }
  }, [items]);
  return (
    <div style={{ minWidth: 200, maxWidth: 200, color: "black" }}>
      <Select
        styles={style}
        className={className}
        isDisabled={disabled}
        value={selectedOption}
        placeholder={loading ? "loading..." : "Select Users"}
        onChange={(res) => {
          if (res.value === "User name") {
            setSelectedOption(res);
            onChange(null);
          } else {
            setSelectedOption(res);
            onChange(res?._id);
            setGetValueInput(getValueInput);
          }
        }}
        onInputChange={(inputValue) => {
          if (inputValue) {
            if (value) {
              if (inputValue === selectedOption?.firstName) {
                setGetValueInput(getValueInput);
              } else {
                setGetValueInput(inputValue);
              }
            } else {
              setGetValueInput(inputValue);
            }
          } else {
            setGetValueInput(getValueInput);
          }
        }}
        options={items}
      />
    </div>
  );
}
