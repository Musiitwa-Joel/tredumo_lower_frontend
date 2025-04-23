import React from "react";
import FuseExample from "@fuse/core/FuseExample";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import clsx from "clsx";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { darken } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";

function CollegeForm() {
  return (
    <div className="p-16">
      <Card
        className={clsx("", "shadow")}
        sx={{
          backgroundColor: (theme) =>
            darken(
              theme.palette.background.paper,
              theme.palette.mode === "light" ? 0.01 : 0.1
            ),
        }}
      >
        <Box
          sx={{
            backgroundColor: "#1e293b",
          }}
          className="p-10"
          style={{
            paddingLeft: 15,
          }}
        >
          <Typography
            variant="h6"
            color="inherit"
            component="div"
            style={{
              //   opacity: 0.7,
              color: "white",
            }}
          >
            Add College
          </Typography>
          {/* <Tabs
            classes={{
              root: "border-b-1",
              flexContainer: "justify-end",
            }}
            value={0}
            // onChange={handleChange}
            textColor="secondary"
            indicatorColor="secondary"
          >
            <Tab
              classes={{ root: "min-w-64" }}
              icon={<FuseSvgIcon>heroicons-outline:eye</FuseSvgIcon>}
            />
          </Tabs> */}
        </Box>
        <div className="max-w-full relative">
          <Box
            component="form"
            sx={{
              "& .MuiTextField-root": { m: 0, width: "100%" },
            }}
            autoComplete="off"
            className={"max-w-full"}
            style={{
              padding: 15,
              //   backgroundColor: "red",
            }}
          >
            <TextField
              label="College Code"
              id="outlined-size-small"
              style={{
                paddingBottom: 15,
              }}
              // defaultValue="Small"
              size="small"
            />

            <TextField
              label="College title"
              id="outlined-size-small"
              style={{
                paddingBottom: 15,
              }}
              // defaultValue="Small"
              size="small"
            />

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Button
                variant="contained"
                color="primary"
                style={{
                  padding: 0,
                  margin: 0,
                }}
              >
                Save
              </Button>
            </div>
          </Box>
        </div>
      </Card>
    </div>
  );
}

export default CollegeForm;
