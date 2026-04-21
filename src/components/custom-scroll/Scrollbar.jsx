import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import { Box, styled } from '@mui/material';

const SimpleBarStyle = styled(SimpleBar)(() => ({
  maxHeight: '100%',
  '& .simplebar-track': {
    opacity: 0,
    visibility: 'hidden',
    pointerEvents: 'none',
  },
  '& .simplebar-scrollbar': {
    display: 'none',
  },
  '& .simplebar-scrollbar:before': {
    display: 'none',
  },
  '& .simplebar-content-wrapper': {
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
  },
  '& .simplebar-content-wrapper::-webkit-scrollbar': {
    width: 0,
    height: 0,
  },
}));



const Scrollbar = (props) => {
  const { children, sx, ...other } = props;
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );

  if (isMobile) {
    return <Box sx={{ overflowX: 'auto' }}>{children}</Box>;
  }

  return (
    <SimpleBarStyle sx={sx} {...other}>
      {children}
    </SimpleBarStyle>
  );
};

export default Scrollbar;
