import React, { useState, useEffect } from 'react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import CustomCKEditor from '../../components/theme-elements/CustomCKEditor';
import ParentCard from 'src/components/shared/ParentCard';
import { toast, ToastContainer } from 'react-toastify';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { Button, Box, Tabs, Tab, Typography, CircularProgress, Paper } from '@mui/material';
import { URLS } from 'src/Url';
import axios from 'axios';

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Privacy Policy' }];

const getAuthToken = () => JSON.parse(localStorage.getItem('user'))?.token || '';

// TabPanel component
const TabPanel = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`terms-tabpanel-${index}`}
      aria-labelledby={`terms-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const Terms = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState({
    customer: '<p>No content available</p>',
    vendor: '<p>No content available</p>',
  });

  const token = getAuthToken();

  const authData = JSON.parse(localStorage.getItem('user'));
  const rolesAndPermission = authData.rolesAndPermission[0];

  const tabLabels = ['Customer', 'Vendor'];
  const tabTypes = ['customer', 'vendor'];

  const getCurrentType = () => tabTypes[activeTab];

  const getData = async (type = getCurrentType()) => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }
    try {
      setLoading(true);
      const res = await axios.get(URLS.GetTypePolicys + type, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const privacyContent =
        res.data.policy?.privacyPolicy?.paragraph || '<p>No content available</p>';

      setData((prev) => ({
        ...prev,
        [type]: privacyContent,
      }));
    } catch (error) {
      toast.error(
        error.response?.data?.message || `Failed to fetch ${tabLabels[activeTab]} Privacy Policy`,
      );
    } finally {
      setLoading(false);
    }
  };

  const getAllData = async () => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }
    try {
      setLoading(true);

      // Fetch data for all types
      const promises = tabTypes.map((type) =>
        axios.get(URLS.GetTypePolicys + type, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      );

      const results = await Promise.allSettled(promises);

      const newData = { ...data };

      results.forEach((result, index) => {
        const type = tabTypes[index];
        if (result.status === 'fulfilled') {
          const privacyContent =
            result.value.data.policy?.privacyPolicy?.paragraph || '<p>No content available</p>';
          newData[type] = privacyContent;
        } else {
          toast.error(`Failed to load ${tabLabels[index]} data`);
          newData[type] = '<p>Error loading content</p>';
        }
      });

      setData(newData);
    } catch (error) {
      toast.error('Failed to fetch Privacy Policy data');
    } finally {
      setLoading(false);
    }
  };

  const updateData = async (type = getCurrentType()) => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }

    const currentData = data[type];
    if (!currentData || currentData === '<p>No content available</p>') {
      toast.error('No content to save.');
      return;
    }

    try {
      setSaving(true);
      await axios.put(
        URLS.UpdateTypePolicys + type,
        { privacyPolicy: currentData },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      toast.success(`${tabLabels[activeTab]} Privacy Policy updated successfully!`);
    } catch (error) {
      toast.error(
        error.response?.data?.message || `Failed to update ${tabLabels[activeTab]} Privacy Policy`,
      );
    } finally {
      setSaving(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleEditorChange = (content) => {
    const currentType = getCurrentType();
    setData((prev) => ({
      ...prev,
      [currentType]: content,
    }));
  };

  const handleSave = () => {
    updateData();
  };

  const handleSaveAll = async () => {
    if (!token) {
      toast.error('Authentication token missing. Please log in.');
      return;
    }

    try {
      setSaving(true);

      const promises = tabTypes.map((type) =>
        axios.put(
          URLS.UpdateTypePolicys + type,
          { privacyPolicy: data[type] },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        ),
      );

      await Promise.all(promises);
      toast.success('All Privacy Policy updated successfully!');
    } catch (error) {
      toast.error('Failed to update some Privacy Policy');
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    getAllData();
  }, []);

  return (
    <PageContainer title="Privacy Policy" description="This is Privacy Policy page">
      <Breadcrumb title="Privacy Policy" items={BCrumb} />
      <ParentCard title="Privacy Policy Management">
        {/* Tabs */}
        <Paper sx={{ width: '100%', mb: 2 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="terms and conditions tabs"
            variant="fullWidth"
          >
            {tabLabels.map((label, index) => (
              <Tab
                key={label}
                label={label}
                id={`terms-tab-${index}`}
                aria-controls={`terms-tabpanel-${index}`}
              />
            ))}
          </Tabs>
        </Paper>

        {/* Tab Panels */}
        {tabTypes.map((type, index) => (
          <TabPanel key={type} value={activeTab} index={index}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                {tabLabels[index]} App Privacy Policy
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Manage the terms and conditions content for the {tabLabels[index].toLowerCase()}{' '}
                application.
              </Typography>
            </Box>

            {loading ? (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 200,
                }}
              >
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>Loading {tabLabels[index]} content...</Typography>
              </Box>
            ) : (
              <CKEditor
                editor={CustomCKEditor}
                data={data[type]}
                onChange={(event, editor) => handleEditorChange(editor.getData())}
                config={{
                  toolbar: [
                    'heading',
                    '|',
                    'bold',
                    'italic',
                    'strikethrough',
                    'link',
                    '|',
                    'bulletedList',
                    'numberedList',
                    'blockQuote',
                    'code',
                    '|',
                    'undo',
                    'redo',
                  ],
                  placeholder: `Type ${tabLabels[index]} Privacy Policy here...`,
                }}
                disabled={saving}
              />
            )}
          </TabPanel>
        ))}

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, mt: 2 }}>
          {rolesAndPermission.privacy_policy_edit === true ||
          rolesAndPermission.accessAll === true ? (
            <>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleSaveAll}
                disabled={saving || loading}
                startIcon={saving ? <CircularProgress size={16} /> : null}
              >
                {saving ? 'Saving All...' : 'Save All'}
              </Button>
            </>
          ) : (
            <></>
          )}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              onClick={() => getData()}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={16} /> : null}
            >
              {loading ? 'Refreshing...' : 'Refresh Current'}
            </Button>
            {rolesAndPermission.privacy_policy_edit === true ||
            rolesAndPermission.accessAll === true ? (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSave}
                  disabled={saving || loading}
                  startIcon={saving ? <CircularProgress size={16} /> : null}
                >
                  {saving ? 'Saving...' : 'Save Current'}
                </Button>
              </>
            ) : (
              <></>
            )}
          </Box>
        </Box>
      </ParentCard>
      <ToastContainer />
    </PageContainer>
  );
};

export default Terms;
