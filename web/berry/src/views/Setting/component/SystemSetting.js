import { Stack } from '@mui/material';
import GitHubOAuthSetting from './subcards/GitHubOAuthSetting';
import GeneralSetting from './subcards/GeneralSetting';
import ConfigureLoginRegistration from './subcards/ConfigureLoginRegistration';
import ConfigureEmailDomainWhitelist from './subcards/ConfigureEmailDomainWhitelist';
import ConfigureSMTP from './subcards/ConfigureSMTP';
import ConfigureFeishuOAuth from './subcards/ConfigureFeishuOAuth';
import ConfigureWeChatServer from './subcards/ConfigureWeChatServer';
import ConfigureMessagePusher from './subcards/ConfigureMessagePusher';
import ConfigureTurnstile from './subcards/ConfigureTurnstile';
import GoogleOAuthSetting from './subcards/GoogleOAuthSetting';
import AppleOAuthSetting from './subcards/AppleOAuthSetting';

const SystemSetting = () => {
  
  return (
    <>
      <Stack spacing={2}>
        <GeneralSetting />
        <ConfigureLoginRegistration />
        <ConfigureEmailDomainWhitelist />
        <ConfigureSMTP />
        <GoogleOAuthSetting />
        <AppleOAuthSetting />
        <GitHubOAuthSetting />
        <ConfigureFeishuOAuth />
        <ConfigureWeChatServer />
        <ConfigureMessagePusher />
        <ConfigureTurnstile />
        
      </Stack>
      
    </>
  );
};

export default SystemSetting;