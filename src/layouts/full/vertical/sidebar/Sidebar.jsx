import { useMediaQuery, Box, Drawer, useTheme, Divider, Typography, Stack, TextField, InputAdornment } from '@mui/material';
import SidebarItems from './SidebarItems';
import config from 'src/context/config';
import { CustomizerContext } from 'src/context/CustomizerContext';
import { useContext } from 'react';
import Logos from '../../../../assets/images/logo.png';
import { IconSearch } from '@tabler/icons-react';

const Sidebar = () => {
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  const { isCollapse, isSidebarHover, setIsSidebarHover, isMobileSidebar, setIsMobileSidebar } =
    useContext(CustomizerContext);

  const MiniSidebarWidth = config.miniSidebarWidth;
  const SidebarWidth = config.sidebarWidth;

  const theme = useTheme();
  const toggleWidth =
    isCollapse == 'mini-sidebar' && !isSidebarHover ? MiniSidebarWidth : SidebarWidth;

  const onHoverEnter = () => {
    if (isCollapse == 'mini-sidebar') {
      setIsSidebarHover(true);
    }
  };

  const onHoverLeave = () => {
    setIsSidebarHover(false);
  };

  if (lgUp) {
    return (
      <Box
        sx={{
          width: toggleWidth,
          flexShrink: 0,
          ...(isCollapse == 'mini-sidebar' && {
            position: 'absolute',
          }),
        }}
      >
        {/* ------------------------------------------- */}
        {/* Sidebar for desktop */}
        {/* ------------------------------------------- */}
        <Drawer
          anchor="left"
          open
          onMouseEnter={onHoverEnter}
          onMouseLeave={onHoverLeave}
          variant="permanent"
          PaperProps={{
            sx: {
              transition: theme.transitions.create('width', {
                duration: theme.transitions.duration.shortest,
              }),
              width: toggleWidth,
              boxSizing: 'border-box',
              overflow: 'hidden',
              background:
                'radial-gradient(circle at top left, rgba(24, 197, 188, 0.20), transparent 28%), linear-gradient(180deg, #0b2b34 0%, #0f2028 48%, #0b141a 100%)',
              color: '#d9f5f1',
              borderRight: '1px solid rgba(255, 255, 255, 0.06)',
              boxShadow: 'inset -1px 0 0 rgba(255, 255, 255, 0.03)',
            },
          }}
        >
          {/* ------------------------------------------- */}
          {/* Sidebar Box */}
          {/* ------------------------------------------- */}
          <Box
            sx={{
              height: '100%',
              px: 1.75,
              py: 1.5,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                flex: 1,
                minHeight: 0,
                overflowY: 'auto',
                overflowX: 'hidden',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                '&::-webkit-scrollbar': {
                  width: 0,
                  height: 0,
                  display: 'none',
                },
                '&::-webkit-scrollbar-track': {
                  background: 'transparent',
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: 'transparent',
                },
              }}
            >
              <Box
                sx={{
                px: 1.5,
                py: 1.5,
                borderRadius: 4,
                border: '0',
                background: 'transparent',
                boxShadow: 'none',
                mb: 1.25,
              }}
            >
                <Stack direction="row" alignItems="center" spacing={1.5}>
                <Box
                  component="img"
                  src={Logos}
                  alt="D-Hub logo"
                  sx={{
                    width: 72,
                    height: 72,
                    objectFit: 'contain',
                    display: 'block',
                    flexShrink: 0,
                  }}
                />
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography variant="subtitle1" fontWeight={800} sx={{ lineHeight: 1.05 }}>
                      D-Hub Admin
                    </Typography>
                  </Box>
                </Stack>

                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search menu, wallets, settlements..."
                  sx={{
                    mt: 1.5,
                    '& .MuiInputBase-root': {
                      color: '#d9f5f1',
                      borderRadius: 999,
                      backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(110, 255, 241, 0.16)',
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <IconSearch size={16} color="#71e7da" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.06)', my: 1.5 }} />
              {/* ------------------------------------------- */}
              {/* Sidebar Items */}
              {/* ------------------------------------------- */}
              <SidebarItems />
            </Box>
            {/* <Profile /> */}
          </Box>
        </Drawer>
      </Box>
    );
  }

  return (
    <Drawer
      anchor="left"
      open={isMobileSidebar}
      onClose={() => setIsMobileSidebar(false)}
      variant="temporary"
      PaperProps={{
        sx: {
          width: SidebarWidth,
          overflow: 'hidden',
          background:
            'radial-gradient(circle at top left, rgba(24, 197, 188, 0.20), transparent 28%), linear-gradient(180deg, #0b2b34 0%, #0f2028 48%, #0b141a 100%)',
          color: '#d9f5f1',
          border: '0 !important',
          boxShadow: (theme) => theme.shadows[8],
        },
      }}
    >
      <Box
        sx={{
          px: 1.75,
          py: 1.5,
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          overflowX: 'hidden',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          '&::-webkit-scrollbar': {
            width: 0,
            height: 0,
            display: 'none',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'transparent',
          },
        }}
      >
        <Box
          sx={{
            px: 1.5,
            py: 1.5,
            borderRadius: 4,
            border: '0',
            background: 'transparent',
            boxShadow: 'none',
            mb: 1.25,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box
            component="img"
            src={Logos}
            alt="D-Hub logo"
            sx={{
              width: 72,
              height: 72,
              objectFit: 'contain',
              display: 'block',
              flexShrink: 0,
            }}
          />
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography variant="subtitle1" fontWeight={800} sx={{ lineHeight: 1.05 }}>
                D-Hub Admin
              </Typography>
            </Box>
          </Stack>
          <TextField
            fullWidth
            size="small"
            placeholder="Search menu, wallets, settlements..."
            sx={{
              mt: 1.5,
              '& .MuiInputBase-root': {
                color: '#d9f5f1',
                borderRadius: 999,
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(110, 255, 241, 0.16)',
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconSearch size={16} color="#71e7da" />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.06)' }} />
        <SidebarItems />
      </Box>
    </Drawer>
  );
};

export default Sidebar;
