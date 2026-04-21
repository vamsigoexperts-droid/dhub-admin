import { styled, Container, Box, useTheme } from '@mui/material';
import { CustomizerContext } from 'src/context/CustomizerContext';
import config from 'src/context/config';
import { useContext } from 'react';
import { Outlet } from 'react-router';
import Header from './vertical/header/Header';
import HorizontalHeader from '../full/horizontal/header/Header';
import Sidebar from './vertical/sidebar/Sidebar';
import Customizer from './shared/customizer/Customizer';
import Navigation from './horizontal/navbar/Navigation';
import ScrollToTop from '../../components/shared/ScrollToTop';
import LoadingBar from '../../LoadingBar';
import OrderNotificationPopup from '../../views/Socketiopopup/OrderNotificationPopup';

const MainWrapper = styled('div')(() => ({
  display: 'flex',
  minHeight: '100vh',
  width: '100%',
  height: '100vh',
  overflow: 'hidden',
}));

const PageWrapper = styled('div')(() => ({
  display: 'flex',
  flexGrow: 1,
  flexDirection: 'column',
  zIndex: 1,
  width: '100%',
  background:
    'radial-gradient(circle at top right, rgba(24, 197, 188, 0.12), transparent 25%), linear-gradient(180deg, #0b2b34 0%, #0f2028 50%, #0b141a 100%)',
  color: '#d9f5f1',
  height: '100vh',
  overflow: 'hidden',
}));

const FullLayout = () => {
  const { activeLayout, isLayout, activeMode, isCollapse } = useContext(CustomizerContext);

  const theme = useTheme();
  const MiniSidebarWidth = config.miniSidebarWidth;

  return (
    <>
      {/* <LoadingBar /> */}
      <MainWrapper className={activeMode === 'dark' ? 'darkbg mainwrapper' : 'mainwrapper'}>
        {/* ------------------------------------------- */}
        {/* Sidebar */}
        {/* ------------------------------------------- */}
        {activeLayout === 'horizontal' ? '' : <Sidebar />}
        {/* ------------------------------------------- */}
        {/* Main Wrapper */}
        {/* ------------------------------------------- */}
        <PageWrapper
          className="page-wrapper"
          sx={{
            ...(isCollapse === 'mini-sidebar' && {
              [theme.breakpoints.up('lg')]: { ml: `${MiniSidebarWidth}px` },
            }),
          }}
        >
          {/* ------------------------------------------- */}
          {/* Header */}
          {/* ------------------------------------------- */}
          {activeLayout === 'horizontal' ? <HorizontalHeader /> : <Header />}
          {/* ------------------------------------------- */}
          {/* PageContent */}
          {/* ------------------------------------------- */}
          {activeLayout === 'horizontal' ? <Navigation /> : ''}
          <Box
            className="page-scroll-container"
            sx={{
              flex: 1,
              minHeight: 0,
              overflowY: 'scroll',
              overflowX: 'hidden',
              pt: '30px',
              pb: 3,
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              '&::-webkit-scrollbar': {
                width: 0,
                height: 0,
                display: 'none',
              },
            }}
          >
            <Container
              sx={{
                maxWidth: isLayout === 'boxed' ? 'lg' : '100%!important',
                color: 'inherit',
              }}
            >
              {/* ------------------------------------------- */}
              {/* Page Route */}
              {/* ------------------------------------------- */}
              <ScrollToTop>
                <Outlet />
              </ScrollToTop>
            </Container>
            {/* ------------------------------------------- */}
            {/* End Page */}
            {/* ------------------------------------------- */}
          </Box>
          <Customizer />
        </PageWrapper>
      </MainWrapper>
      <OrderNotificationPopup />
    </>
  );
};

export default FullLayout;
