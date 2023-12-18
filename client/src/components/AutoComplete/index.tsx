// React Imports
import React from "react";
// MUI Imports
import {
  Autocomplete,
  InputAdornment,
  TextField,
  createFilterOptions,
} from "@mui/material";

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

  const filteredOptions = formik
    ? props.options.filter(
        (option: any) =>
          !formik.values.addPeople.some(
            (selectedUser: any) => selectedUser._id === option._id
          )
      )
    : props.options;

  return (
    <>
      <Autocomplete
        id="tags-outlined"
        fullWidth
        options={filteredOptions || []}
        value={formik ? formik?.values[name] || [] : props.value || []}
        onChange={(event, value) => {
          formik
            ? formik?.setFieldValue(name, value)
            : props.onChange && props.onChange(value);
        }}
        getOptionLabel={(option) => option?.name}
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
