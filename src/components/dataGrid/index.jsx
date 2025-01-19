import React, { useEffect, useState, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import { useNavigate } from "react-router-dom";

const DataGrid = () => {
  const navigate = useNavigate();
  const [rowData, setRowData] = useState([]);
  const [filterModel, setFilterModel] = useState(null);
  const [loading, setLoading] = useState(true);
  const gridRef = useRef(null);
  const actionCellRenderer = (params) => {
    return (
      <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
        <button
          onClick={() => {
            // Navigate to the details page with the car's ID in the URL
            navigate(`/car-details/${params.data._id}`);
          }}
          style={{
            padding: "5px 10px",
            backgroundColor: "#007BFF",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          View
        </button>
        <button
          onClick={async () => {
            if (window.confirm("Are you sure you want to delete this row?")) {
              try {
                const response = await fetch(
                  `http://localhost:4000/data/${params.data._id}`,
                  {
                    method: "DELETE",
                  }
                );

                if (response.ok) {
                  alert("Row deleted successfully!");
                  params.api.applyTransaction({ remove: [params.data] }); // Remove the row
                } else {
                  alert("Failed to delete the row.");
                }
              } catch (error) {
                console.error("Error deleting row:", error);
                alert("An error occurred while deleting the row.");
              }
            }
          }}
          style={{
            padding: "5px 10px",
            backgroundColor: "#DC3545",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Delete
        </button>
      </div>
    );
  };
  const frameworkComponents = {
    actionCellRenderer,
  };

  const [columnDefs] = useState([
    {
      field: "_id",
      headerName: "ID",
      hide: true,
    }, // Hide ID but keep it for updates
    {
      field: "Brand",
      editable: false,
      headerName: "Brand",
      filter: "agTextColumnFilter",
      filterParams: {
        textFormatter: (value) => value?.trim(), // Trim spaces during filter comparison
      },
    },
    { field: "Model", editable: false, headerName: "Model" },
    { field: "AccelSec", editable: false, headerName: "Acceleration (Sec)" },
    {
      field: "TopSpeed_KmH",
      editable: false,
      headerName: "Top Speed (Km/H)",
      filter: "agNumberColumnFilter",
    },
    { field: "Range_Km", editable: false, headerName: "Range (Km)" },
    {
      field: "Efficiency_WhKm",
      editable: false,
      headerName: "Efficiency (Wh/Km)",
    },
    {
      field: "FastCharge_KmH",
      editable: false,
      headerName: "Fast Charge (Km/H)",
    },
    { field: "RapidCharge", editable: false, headerName: "Rapid Charge" },
    { field: "PowerTrain", editable: false, headerName: "Powertrain" },
    { field: "PlugType", editable: false, headerName: "Plug Type" },
    { field: "BodyStyle", editable: false, headerName: "Body Style" },
    { field: "Segment", editable: false, headerName: "Segment" },
    { field: "Seats", editable: false, headerName: "Seats" },
    { field: "PriceEuro", editable: false, headerName: "Price (Euro)" },
    { field: "Date", editable: false, headerName: "Date Added" },
    {
      headerName: "Actions",
      field: "actions",
      cellRenderer: actionCellRenderer, // Reference to a custom cell renderer
      filter: false,
      sortable: false,
      editable: false,
      width: 150, // Adjust width as needed
    },
  ]);

  console.log({ filterModel });

  const defaultColDef = {
    filter: false,
    sortable: true,
    resizable: true,
    floatingFilter: false,
  };
  console.log({ rowData });
  const getData = async () => {
    setLoading(true); // Start loading
    try {
      const queryParams = filterModel
        ? `?filterModel=${encodeURIComponent(JSON.stringify(filterModel))}`
        : "";

      const response = await fetch(`http://localhost:4000/data${queryParams}`);
      const data = await response.json();

      if (data.success) {
        setRowData(data.data); // Set the fetched data to the state
      } else {
        console.error("Error fetching data:", data.message);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Start loading
    }
  };
  useEffect(() => {
    const gridApi = gridRef.current?.api;
    if (gridApi) {
      if (loading) {
        gridApi.showLoadingOverlay();
      } else {
        gridApi.hideOverlay();
      }
    }
  }, [loading]);

  // Handle filter changes
  const onFilterChanged = (event) => {
    const gridApi = event.api;
    const appliedFilterModel = gridApi.getFilterModel();

    setFilterModel(appliedFilterModel); // Update the filter model state
  };
  useEffect(() => {
    if (filterModel) {
      getData();
    }
  }, [filterModel]);

  // Fetch data whenever the filter model changes

  useEffect(() => {
    getData(); // Call getData with the updated filter model
  }, []);


  const onCellValueChanged = async (event) => {
    const updatedData = event.data; // Get updated row
    try {
      await fetch(`http://localhost:4000/data/${updatedData._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });
      console.log("Data updated successfully:", updatedData);
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "95vh",
        width: "100vw",
        backgroundColor: "#f4f4f4",
      }}
    >
      <div
        className="ag-theme-alpine"
        style={{
          height: "90%",
          width: "90%",
          maxWidth: "1200px",
          backgroundColor: "white",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          borderRadius: "8px",
          padding: "10px",
        }}
      >
        <AgGridReact
          ref={gridRef}
          style={{ width: "100%" }}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowSelection={"multiple"}
          pagination={true}
          paginationPageSize={20}
          suppressFilter={true}
          frameworkComponents={frameworkComponents}
          onFilterChanged={onFilterChanged}
          overlayLoadingTemplate={"<span>Loading...</span>"}
          // onCellValueChanged={onCellValueChanged} // Trigger update on value change
        />
      </div>
    </div>
  );
};

export default DataGrid;
