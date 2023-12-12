import {
  Autocomplete,
  InputAdornment,
  TextField,
  createFilterOptions,
} from "@mui/material";
import React from "react";
import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";

type Props = {
  options: any;
  label: string;
  multiple?: boolean;
  formik?: any;
  name?: string;
  onChange?: any;
  value?: string[] | {};
  placeholder?: string;
  startAndornment?: React.ReactNode;
  variant?: "standard" | "filled" | "outlined";
  isLoading?: boolean;
};

const filterOptions = createFilterOptions({
  matchFrom: "any",
  limit: 100,
});

const CustomAutocomplete = (props: Props) => {
  const { formik, name, placeholder }: any = props;

  return (
    <>
      <Autocomplete
        id="tags-outlined"
        fullWidth
        options={props.options || []}
        value={formik ? formik?.values[name] || [] : props.value || []}
        onChange={(event, value) => {
          formik
            ? formik?.setFieldValue(name, value)
            : props.onChange && props.onChange(value);
        }}
        getOptionLabel={(option) => option?.name}
        renderOption={(props: any, option: any, { inputValue }) => {
          const matches = match(option.name, inputValue, {
            insideWords: true,
          });
          const parts = parse(option.name, matches);
          return (
            <li {...props}>
              <div>
                {parts.map((part: any, index: any) => (
                  <span
                    key={option?.id}
                    style={{
                      fontWeight: part.highlight ? 800 : 400,
                    }}
                  >
                    {part.text}
                  </span>
                ))}
              </div>
            </li>
          );
        }}
        sx={{
          fontWeight: "400",
          borderRadius: "5px",
          background: "#fff",
          border: "none",
          minHeight: "50px !important",
          width: "100%",

          // target the input
          "& .MuiInputBase-root": {
            minHeight: "50px !important",
          },

          color: (theme: any) => theme.palette.text.primary,
          "& .MuiSelect-select": {
            display: "flex",
            alignItems: "center",
          },

          // disabled
          "& .Mui-disabled": {
            color: (theme: any) => theme.palette.text.disabled,
          },

          // target the placeholder
          "& .MuiInputBase-input::placeholder": {
            fontSize: "14px",
          },
        }}
        placeholder="Search"
        multiple={props.multiple ?? true}
        filterSelectedOptions
        filterOptions={(options, state) => {
          const filteredOptions = options.filter((option) =>
            option?.name?.toLowerCase().includes(state.inputValue.toLowerCase())
          );
          // Merge the filtered options with the ones from createFilterOptions
          return filterOptions(filteredOptions, state);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            // label={props.label}
            placeholder={placeholder ?? ""}
            error={formik?.touched[name] && Boolean(formik?.errors[name])}
            // helperText={formik?.touched[name] && formik?.errors[name]}
            onBlur={formik?.handleBlur}
            variant={"outlined"}
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <>
                  {props.startAndornment && (
                    <InputAdornment position="start">
                      {props.startAndornment}
                    </InputAdornment>
                  )}
                  {params.InputProps.startAdornment}
                </>
              ),
            }}
          />
        )}
      />
    </>
  );
};

export default CustomAutocomplete;
