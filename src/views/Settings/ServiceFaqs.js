import React, { useState, useEffect } from 'react';
import CustomTextField from '../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../components/forms/theme-elements/CustomFormLabel';
import Breadcrumb from '../../layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '../../components/container/PageContainer';
import { IconPlus, IconEdit, IconTrash } from '@tabler/icons-react';
import ParentCard from '../../components/shared/ParentCard';
import { toast, ToastContainer } from 'react-toastify';
import { DataGrid } from '@mui/x-data-grid';
import { URLS } from '../../Url';
import axios from 'axios';
import {
  Card,
  CardContent,
  Divider,
  Box,
  Button,
  CardHeader,
  Grid,
  TextField,
  CircularProgress,
  Tabs,
  Tab,
} from '@mui/material';

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Service Faqs' }];

// Tab panel component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`faq-tabpanel-${index}`}
      aria-labelledby={`faq-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function Faqs() {
  const authData = JSON.parse(localStorage.getItem('user'));
  const token = authData?.token;
  const rolesAndPermission = authData.rolesAndPermission[0];

  const [currentTab, setCurrentTab] = useState(0);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [form, setForm] = useState({ question: '', answer: '', type: 'services' });
  const [formEdit, setFormEdit] = useState({ question: '', answer: '', _id: '', type: 'services' });
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);

  const faqTypes = ['services', 'ride'];
  const tabLabels = {
    services: 'Services FAQs',
    ride: 'Ride FAQs',
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
    setSearch('');
    resetForm();
    getData(faqTypes[newValue]);
  };

  const handleInputChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
      type: faqTypes[currentTab],
    });
  };

  const handleEditInputChange = (e) => {
    setFormEdit({
      ...formEdit,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddPopup = () => {
    setShowAdd(!showAdd);
    setShowEdit(false);
    scrollToTop();
  };

  const handleEditPopup = (rowData) => {
    setFormEdit(rowData);
    setShowAdd(false);
    setShowEdit(true);
    scrollToTop();
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const formData = {
      type: faqTypes[currentTab],
      question: form.question,
      answer: form.answer,
    };

    setLoading(true);
    axios
      .post(URLS.AddServiceFaqs, formData, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        toast.success(res.data.message || 'FAQ added successfully');
        resetForm();
        getData(faqTypes[currentTab]);
      })
      .catch((err) => {
        console.error('Add FAQ error:', err);
        toast.error(err.response?.data?.message || 'Failed to add FAQ');
      })
      .finally(() => setLoading(false));
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const formData = {
      question: formEdit.question,
      answer: formEdit.answer,
    };

    setLoading(true);
    axios
      .put(`${URLS.EditServiceFaqs}${formEdit._id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        toast.success(res.data.message || 'FAQ updated successfully');
        resetForm();
        getData(faqTypes[currentTab]);
      })
      .catch((err) => {
        console.error('Edit FAQ error:', err);
        toast.error(err.response?.data?.message || 'Failed to update FAQ');
      })
      .finally(() => setLoading(false));
  };

  const handleDelete = (item) => {
    if (window.confirm('Do you really want to delete this FAQ?')) {
      setLoading(true);
      axios
        .delete(`${URLS.DeleteServiceFaqs}${item._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          toast.success(res.data.message || 'FAQ deleted successfully');
          getData(faqTypes[currentTab]);
        })
        .catch((err) => {
          console.error('Delete FAQ error:', err);
          toast.error(err.response?.data?.message || 'Failed to delete FAQ');
        })
        .finally(() => setLoading(false));
    }
  };

  const getData = (type = faqTypes[currentTab]) => {
    setLoading(true);
    axios
      .get(URLS.GetServiceFaqs + type, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        setData(res.data.data || []);
      })
      .catch((err) => {
        console.error('Get FAQs error:', err);
        toast.error('Failed to fetch FAQs');
      })
      .finally(() => setLoading(false));
  };

  const resetForm = () => {
    setForm({ question: '', answer: '', type: faqTypes[currentTab] });
    setFormEdit({ question: '', answer: '', _id: '', type: faqTypes[currentTab] });
    setShowAdd(false);
    setShowEdit(false);
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (search === '') {
      setFilteredData(data);
    } else {
      const filtered = data.filter((item) => {
        return (
          item.question?.toLowerCase().includes(search.toLowerCase()) ||
          item.answer?.toLowerCase().includes(search.toLowerCase())
        );
      });
      setFilteredData(filtered);
    }
  }, [data, search]);

  const columns = [
    {
      field: 'sno',
      headerName: 'S. No',
      width: 70,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const sortedRows = params.api.getSortedRowIds();
        return sortedRows.indexOf(params.id) + 1;
      },
    },
    { field: 'question', headerName: 'Question', flex: 1 },
    { field: 'answer', headerName: 'Answer', flex: 1 },
    {
      field: 'action',
      headerName: 'Action',
      flex: 1,
      minWidth: 150,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          {rolesAndPermission.service_faqs_edit === true ||
          rolesAndPermission.accessAll === true ? (
            <>
              <Button
                size="small"
                color="primary"
                variant="contained"
                onClick={() => handleEditPopup(params.row)}
                disabled={loading}
                sx={{ minWidth: '32px', padding: '4px 6px' }}
                aria-label={`Edit ${params.row.question}`}
              >
                <IconEdit stroke={1.5} size={18} />
              </Button>
            </>
          ) : (
            <></>
          )}

          {rolesAndPermission.service_faqs_delete === true ||
          rolesAndPermission.accessAll === true ? (
            <>
              <Button
                size="small"
                color="error"
                variant="contained"
                onClick={() => handleDelete(params.row)}
                disabled={loading}
                sx={{ minWidth: '32px', padding: '4px 6px' }}
                aria-label={`Delete ${params.row.question}`}
              >
                <IconTrash stroke={1.5} size={18} />
              </Button>
            </>
          ) : (
            <></>
          )}
        </Box>
      ),
    },
  ];

  const rows = filteredData.map((item) => ({ id: item._id, ...item }));

  return (
    <PageContainer title="Service Faqs" description="this is Service Faqs page">
      <Breadcrumb title="Service Faqs" items={BCrumb} />

      {/* Tabs Navigation */}
      <Card sx={{ mb: 3 }} elevation={9} variant="outlined">
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          aria-label="FAQ types tabs"
          variant="scrollable"
          scrollButtons="auto"
        >
          {faqTypes.map((type, index) => (
            <Tab
              key={type}
              label={tabLabels[type]}
              id={`faq-tab-${index}`}
              aria-controls={`faq-tabpanel-${index}`}
            />
          ))}
        </Tabs>
      </Card>

      {showAdd && (
        <form onSubmit={handleAddSubmit}>
          <ParentCard
            title={`Create ${tabLabels[faqTypes[currentTab]]}`}
            sx={{ overflowX: 'hidden' }}
          >
            <Grid container rowSpacing={3}>
              <Grid item xs={12} sx={{ padding: 1 }}>
                <CustomFormLabel htmlFor="question">Question</CustomFormLabel>
                <CustomTextField
                  onChange={handleInputChange}
                  placeholder="Enter Question"
                  value={form.question}
                  name="question"
                  id="question"
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sx={{ padding: 1 }}>
                <CustomFormLabel htmlFor="answer">Answer</CustomFormLabel>
                <CustomTextField
                  onChange={handleInputChange}
                  placeholder="Enter Answer"
                  value={form.answer}
                  name="answer"
                  id="answer"
                  fullWidth
                  multiline
                  rows={4}
                  required
                />
              </Grid>
            </Grid>
            <Box sx={{ float: 'right', py: 1 }}>
              <Button
                variant="contained"
                color="error"
                sx={{ mr: 1 }}
                onClick={() => setShowAdd(false)}
                disabled={loading}
              >
                Close
              </Button>
              <Button variant="contained" color="primary" type="submit" disabled={loading}>
                {loading ? <CircularProgress size={20} color="inherit" /> : 'Submit'}
              </Button>
            </Box>
          </ParentCard>
        </form>
      )}

      {showEdit && (
        <form onSubmit={handleEditSubmit}>
          <ParentCard title="Edit Servic FAQ" sx={{ overflowX: 'hidden' }}>
            <Grid container rowSpacing={3}>
              <Grid item xs={12} sx={{ padding: 1 }}>
                <CustomFormLabel htmlFor="editQuestion">Question</CustomFormLabel>
                <CustomTextField
                  onChange={handleEditInputChange}
                  placeholder="Enter Question"
                  value={formEdit.question}
                  name="question"
                  id="editQuestion"
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sx={{ padding: 1 }}>
                <CustomFormLabel htmlFor="editAnswer">Answer</CustomFormLabel>
                <CustomTextField
                  onChange={handleEditInputChange}
                  placeholder="Enter Answer"
                  value={formEdit.answer}
                  name="answer"
                  id="editAnswer"
                  fullWidth
                  multiline
                  rows={4}
                  required
                />
              </Grid>
            </Grid>
            <Box sx={{ float: 'right', py: 1 }}>
              <Button
                variant="contained"
                color="error"
                sx={{ mr: 1 }}
                onClick={() => setShowEdit(false)}
                disabled={loading}
              >
                Close
              </Button>
              <Button variant="contained" color="primary" type="submit" disabled={loading}>
                {loading ? <CircularProgress size={20} color="inherit" /> : 'Submit'}
              </Button>
            </Box>
          </ParentCard>
        </form>
      )}

      {/* Tab Panels */}
      {faqTypes.map((type, index) => (
        <TabPanel key={type} value={currentTab} index={index}>
          <Card sx={{ padding: 0 }} elevation={9} variant="outlined">
            <CardHeader
              title={tabLabels[type]}
              action={
                <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
                  <TextField
                    size="small"
                    placeholder={`Search ${tabLabels[type]}...`}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  {rolesAndPermission.service_faqs_add === true ||
                  rolesAndPermission.accessAll === true ? (
                    <>
                      <Button variant="contained" color="primary" onClick={handleAddPopup}>
                        <IconPlus /> Create Service FAQ
                      </Button>
                    </>
                  ) : (
                    <></>
                  )}
                </Box>
              }
              sx={{
                pb: 2,
                pt: 2,
                px: 2,
                alignItems: 'center',
              }}
            />
            <Divider />
            <CardContent>
              <Box sx={{ height: 'auto', width: '100%' }}>
                <DataGrid
                  rows={rows}
                  columns={columns}
                  loading={loading}
                  pageSize={5}
                  rowHeight={38}
                  rowsPerPageOptions={[5, 10, 20]}
                  disableRowSelectionOnClick
                />
              </Box>
            </CardContent>
          </Card>
        </TabPanel>
      ))}

      <ToastContainer position="top-right" autoClose={3000} />
    </PageContainer>
  );
}

export default Faqs;
