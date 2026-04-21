import { ListSubheader, styled } from '@mui/material';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { IconDots } from '@tabler/icons-react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';

const NavGroup = ({ item, hideMenu }) => {
  const ListSubheaderStyle = styled((props) => <ListSubheader disableSticky {...props} />)(
    ({ theme }) => ({
      ...theme.typography.overline,
      fontWeight: '800',
      marginTop: theme.spacing(2.5),
      marginBottom: theme.spacing(0.75),
      color: '#77e7dc',
      lineHeight: '24px',
      padding: '4px 12px 4px 16px',
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
    }),
  );

  return (
    <ListSubheaderStyle>
      {hideMenu ? <IconDots size="14" /> : item?.subheader}
    </ListSubheaderStyle>
  );
};

export default NavGroup;
