// path: admin/components/CustomDashboard.jsx
import React from 'react';
import { Box, H2, Text } from '@admin-bro/design-system';

const CustomDashboard = () => {
  return (
    <Box variant="grey">
      <H2>Welcome to Your Admin Panel!</H2>

      <Text>
        AdminBro is a modern Admin Panel for Node.js apps based on React.
      </Text>
      <Text>
        It allows you to manage the resources of your application with ease.
      </Text>
      <Text>
        You can customize the resources, actions, and the dashboard itself.
      </Text>
    </Box>
  );
};

export default CustomDashboard;
