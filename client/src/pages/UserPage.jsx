import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Snackbar,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import RefreshIcon from "@mui/icons-material/Refresh";
import SaveIcon from "@mui/icons-material/Save";

import {
  createUser,
  deleteUser,
  getUsers,
  updateUser,
} from "../services/userApi";

const initialForm = {
  name: "",
  email: "",
  age: "",
};

export default function UserPage() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(initialForm);

  const [selectedUserId, setSelectedUserId] = useState(null);

  const [pageLoading, setPageLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const [errors, setErrors] = useState({});

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const isEditing = Boolean(selectedUserId);

  const showNotification = useCallback((message, severity = "success") => {
    setNotification({
      open: true,
      message,
      severity,
    });
  }, []);

  const loadUsers = useCallback(async () => {
    try {
      setPageLoading(true);

      const response = await getUsers();

      setUsers(response.users ?? []);
    } catch (error) {
      showNotification(
        error.response?.data?.message || "Unable to load users",
        "error"
      );
    } finally {
      setPageLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    // The initial API request intentionally starts after the component mounts.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadUsers();
  }, [loadUsers]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));

    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: "",
    }));
  }

  function validateForm() {
    const nextErrors = {};

    const name = form.name.trim();
    const email = form.email.trim();
    const age = form.age === "" ? null : Number(form.age);

    if (!name) {
      nextErrors.name = "Name is required";
    } else if (name.length < 2) {
      nextErrors.name = "Name must contain at least 2 characters";
    }

    if (!email) {
      nextErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = "Enter a valid email address";
    }

    if (age !== null && (!Number.isInteger(age) || age < 0)) {
      nextErrors.age = "Age must be a positive whole number";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  function resetForm() {
    setForm(initialForm);
    setSelectedUserId(null);
    setErrors({});
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const userData = {
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
    };

    if (form.age !== "") {
      userData.age = Number(form.age);
    }

    try {
      setFormLoading(true);

      if (isEditing) {
        const response = await updateUser(selectedUserId, userData);

        setUsers((currentUsers) =>
          currentUsers.map((user) =>
            user._id === selectedUserId
              ? response.user ?? { ...user, ...userData }
              : user
          )
        );

        showNotification(response.message || "User updated successfully");
      } else {
        const response = await createUser(userData);

        if (response.user) {
          setUsers((currentUsers) => [response.user, ...currentUsers]);
        } else {
          await loadUsers();
        }

        showNotification(response.message || "User created successfully");
      }

      resetForm();
    } catch (error) {
      showNotification(
        error.response?.data?.message ||
          `Unable to ${isEditing ? "update" : "create"} user`,
        "error"
      );
    } finally {
      setFormLoading(false);
    }
  }

  function handleEdit(user) {
    setSelectedUserId(user._id);

    setForm({
      name: user.name ?? "",
      email: user.email ?? "",
      age:
        user.age === undefined || user.age === null
          ? ""
          : String(user.age),
    });

    setErrors({});

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function openDeleteDialog(user) {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  }

  function closeDeleteDialog() {
    if (deleteLoading) {
      return;
    }

    setDeleteDialogOpen(false);
    setUserToDelete(null);
  }

  async function handleDelete() {
    if (!userToDelete?._id) {
      return;
    }

    try {
      setDeleteLoading(true);

      const response = await deleteUser(userToDelete._id);

      setUsers((currentUsers) =>
        currentUsers.filter((user) => user._id !== userToDelete._id)
      );

      if (selectedUserId === userToDelete._id) {
        resetForm();
      }

      showNotification(response.message || "User deleted successfully");
      closeDeleteDialog();
    } catch (error) {
      showNotification(
        error.response?.data?.message || "Unable to delete user",
        "error"
      );
    } finally {
      setDeleteLoading(false);
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  }

  const columns = useMemo(
    () => [
      {
        field: "name",
        headerName: "Name",
        flex: 1,
        minWidth: 160,
      },
      {
        field: "email",
        headerName: "Email",
        flex: 1.4,
        minWidth: 220,
      },
      {
        field: "age",
        headerName: "Age",
        type: "number",
        width: 100,
        valueFormatter: (value) =>
          value === undefined || value === null ? "—" : value,
      },
      {
        field: "createdAt",
        headerName: "Created",
        minWidth: 170,
        flex: 0.8,
        valueFormatter: (value) => {
          if (!value) {
            return "—";
          }

          return new Date(value).toLocaleString("en-GB");
        },
      },
      {
        field: "actions",
        headerName: "Actions",
        width: 130,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        renderCell: (params) => (
          <Stack direction="row" spacing={0.5}>
            <Tooltip title="Edit user">
              <IconButton
                color="primary"
                size="small"
                onClick={() => handleEdit(params.row)}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Delete user">
              <IconButton
                color="error"
                size="small"
                onClick={() => openDeleteDialog(params.row)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        ),
      },
    ],
    []
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "grey.100",
        py: 5,
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={3}>
          <Box>
            <Typography variant="h4" component="h1" fontWeight={700}>
              User Management
            </Typography>

            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              Create, update and delete application users.
            </Typography>
          </Box>

          <Card elevation={2}>
            <CardContent>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ mb: 3 }}
              >
                <Typography variant="h5" component="h2">
                  {isEditing ? "Edit User" : "Create User"}
                </Typography>

                {isEditing && (
                  <IconButton
                    onClick={resetForm}
                    disabled={formLoading}
                    aria-label="Cancel editing"
                  >
                    <CloseIcon />
                  </IconButton>
                )}
              </Stack>

              <Box component="form" onSubmit={handleSubmit} noValidate>
                <Stack spacing={2.5}>
                  <TextField
                    label="Name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    error={Boolean(errors.name)}
                    helperText={errors.name}
                    disabled={formLoading}
                    required
                    fullWidth
                  />

                  <TextField
                    label="Email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    error={Boolean(errors.email)}
                    helperText={errors.email}
                    disabled={formLoading}
                    required
                    fullWidth
                  />

                  <TextField
                    label="Age"
                    name="age"
                    type="number"
                    value={form.age}
                    onChange={handleChange}
                    error={Boolean(errors.age)}
                    helperText={errors.age}
                    disabled={formLoading}
                    fullWidth
                    slotProps={{
                      htmlInput: {
                        min: 0,
                        step: 1,
                      },
                    }}
                  />

                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={formLoading}
                      startIcon={
                        formLoading ? (
                          <CircularProgress size={18} color="inherit" />
                        ) : isEditing ? (
                          <SaveIcon />
                        ) : (
                          <PersonAddIcon />
                        )
                      }
                    >
                      {formLoading
                        ? "Saving..."
                        : isEditing
                          ? "Update User"
                          : "Create User"}
                    </Button>

                    {isEditing && (
                      <Button
                        type="button"
                        variant="outlined"
                        size="large"
                        onClick={resetForm}
                        disabled={formLoading}
                      >
                        Cancel
                      </Button>
                    )}
                  </Stack>
                </Stack>
              </Box>
            </CardContent>
          </Card>

          <Card elevation={2}>
            <CardContent>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                alignItems={{ xs: "stretch", sm: "center" }}
                justifyContent="space-between"
                spacing={2}
                sx={{ mb: 2 }}
              >
                <Box>
                  <Typography variant="h5" component="h2">
                    Users
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    {users.length} user{users.length === 1 ? "" : "s"} found
                  </Typography>
                </Box>

                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={loadUsers}
                  disabled={pageLoading}
                >
                  Refresh
                </Button>
              </Stack>

              <Box sx={{ width: "100%" }}>
                <DataGrid
                  rows={users}
                  columns={columns}
                  getRowId={(row) => row._id}
                  loading={pageLoading}
                  disableRowSelectionOnClick
                  autoHeight
                  initialState={{
                    pagination: {
                      paginationModel: {
                        page: 0,
                        pageSize: 5,
                      },
                    },
                  }}
                  pageSizeOptions={[5, 10, 25]}
                  sx={{
                    border: 0,
                    minHeight: 300,
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Stack>
      </Container>

      <Dialog
        open={deleteDialogOpen}
        onClose={closeDeleteDialog}
        aria-labelledby="delete-user-title"
      >
        <DialogTitle id="delete-user-title">Delete user?</DialogTitle>

        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete{" "}
            <strong>{userToDelete?.name}</strong>? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={closeDeleteDialog} disabled={deleteLoading}>
            Cancel
          </Button>

          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={deleteLoading}
            startIcon={
              deleteLoading ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                <DeleteIcon />
              )
            }
          >
            {deleteLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={() =>
          setNotification((current) => ({
            ...current,
            open: false,
          }))
        }
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Alert
          severity={notification.severity}
          variant="filled"
          onClose={() =>
            setNotification((current) => ({
              ...current,
              open: false,
            }))
          }
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
