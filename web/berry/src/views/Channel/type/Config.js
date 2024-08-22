
import i18n from 'i18next';

const defaultConfig = {
  input: {
    name: '',
    type: 1,
    key: '',
    base_url: '',
    other: '',
    model_mapping: '',
    models: [],
    groups: ['default'],
    config: {}
  },
  inputLabel: {
    name: i18n.t('channelName'),
    type: i18n.t('channelType'),
    base_url: i18n.t('channelAPIAddress'),
    key: i18n.t('key'),
    other: i18n.t('otherParams'),
    models: i18n.t('models'),
    model_mapping: i18n.t('modelMapping'),
    groups: i18n.t('userGroups'),
    config: null
  },
  prompt: {
    type: i18n.t('selectChannelType'),
    name: i18n.t('nameChannel'),
    base_url: i18n.t('optionalAPIAddress'),
    key: i18n.t('enterAuthKey'),
    other: '',
    models: i18n.t('selectSupportedModels'),
    model_mapping: i18n.t('enterModelMapping'),
    groups: i18n.t('selectUserGroups'),
    config: null
  },
  modelGroup: 'openai'
};

const typeConfig = {
  3: {
    inputLabel: {
      base_url: i18n.t('AZURE_OPENAI_ENDPOINT'),
      other: i18n.t('defaultAPIVersion')
    },
    prompt: {
      base_url: i18n.t('pleaseFillInAZURE_OPENAI_ENDPOINT'),
      other: i18n.t('pleaseEnterDefaultAPIVersion')
    }
  },
  11: {
    input: {
      models: ['PaLM-2']
    },
    modelGroup: 'google palm'
  },
  14: {
    input: {
      models: ['claude-instant-1', 'claude-2', 'claude-2.0', 'claude-2.1']
    },
    modelGroup: 'anthropic'
  },
  15: {
    input: {
      models: ['ERNIE-Bot', 'ERNIE-Bot-turbo', 'ERNIE-Bot-4', 'Embedding-V1']
    },
    prompt: {
      key: i18n.t('enterInTheFollowingFormatAPIKeySecretKey')
    },
    modelGroup: 'baidu'
  },
  16: {
    input: {
      models: ['glm-4', 'glm-4v', 'glm-3-turbo', 'chatglm_turbo', 'chatglm_pro', 'chatglm_std', 'chatglm_lite']
    },
    modelGroup: 'zhipu'
  },
  17: {
    inputLabel: {
      other: i18n.t('pluginParameters')
    },
    input: {
      models: ['qwen-turbo', 'qwen-plus', 'qwen-max', 'qwen-max-longcontext', 'text-embedding-v1']
    },
    prompt: {
      other: i18n.t('pleaseEnterPluginParameters')
    },
    modelGroup: 'ali'
  },
  18: {
    inputLabel: {
      other: i18n.t('versionNumber')
    },
    input: {
      models: ['SparkDesk', 'SparkDesk-v1.1', 'SparkDesk-v2.1', 'SparkDesk-v3.1', 'SparkDesk-v3.5', 'SparkDesk-v4.0']
    },
    prompt: {
      key: i18n.t('enterInTheFollowingFormatAPPIDAPISecretAPIKey'),
      other: i18n.t('pleaseEnterVersionNumber')
    },
    modelGroup: 'xunfei'
  },
  19: {
    input: {
      models: ['360GPT_S2_V9', 'embedding-bert-512-v1', 'embedding_s1_v1', 'semantic_similarity_s1_v1']
    },
    modelGroup: '360'
  },
  22: {
    prompt: {
      key: i18n.t('enterInTheFollowingFormatAPIKeyAppId')
    }
  },
  23: {
    input: {
      models: ['hunyuan']
    },
    prompt: {
      key: i18n.t('enterInTheFollowingFormatAppIdSecretIdSecretKey')
    },
    modelGroup: 'tencent'
  },
  24: {
    inputLabel: {
      other: i18n.t('versionNumber')
    },
    input: {
      models: ['gemini-pro']
    },
    prompt: {
      other: i18n.t('pleaseEnterVersionNumber')
    },
    modelGroup: 'google gemini'
  },
  25: {
    input: {
      models: ['moonshot-v1-8k', 'moonshot-v1-32k', 'moonshot-v1-128k']
    },
    modelGroup: 'moonshot'
  },
  26: {
    input: {
      models: ['Baichuan2-Turbo', 'Baichuan2-Turbo-192k', 'Baichuan-Text-Embedding']
    },
    modelGroup: 'baichuan'
  },
  27: {
    input: {
      models: ['abab5.5s-chat', 'abab5.5-chat', 'abab6-chat']
    },
    modelGroup: 'minimax'
  },
  29: {
    modelGroup: 'groq'
  },
  30: {
    modelGroup: 'ollama'
  },
  31: {
    modelGroup: 'lingyiwanwu'
  },
  33: {
    inputLabel: {
      key: '',
      config: {
        region: i18n.t('Region'),
        ak: i18n.t('AccessKey'),
        sk: i18n.t('SecretKey')
      }
    },
    prompt: {
      key: '',
      config: {
        region: i18n.t('regionExample'),
        ak: i18n.t('AWSIAMAccessKey'),
        sk: i18n.t('AWSIAMSecretKey')
      }
    },
    modelGroup: 'anthropic'
  },
  34: {
    inputLabel: {
      config: {
        user_id: i18n.t('UserID')
      }
    },
    prompt: {
      models: i18n.t('forCozeModelNameIsBotID'),
      config: {
        user_id: i18n.t('userIDGeneratingThisKey')
      }
    },
    modelGroup: 'Coze'
  },
  37: {
    inputLabel: {
      config: {
        user_id: i18n.t('AccountID')
      }
    },
    prompt: {
      config: {
        user_id: i18n.t('pleaseEnterAccountID')
      }
    },
    modelGroup: 'Cloudflare'
  },
  42: {
    inputLabel: {
      key: '',
      config: {
        region: i18n.t('VertexAIRegion'),
        vertex_ai_project_id: i18n.t('VertexAIProjectID'),
        vertex_ai_adc: i18n.t('GoogleCloudApplicationDefaultCredentialsJSON')
      }
    },
    prompt: {
      key: '',
      config: {
        region: i18n.t('VertexAIRegionExample'),
        vertex_ai_project_id: i18n.t('VertexAIProjectID'),
        vertex_ai_adc: i18n.t('GoogleCloudApplicationDefaultCredentialsJSONLink')
      }
    },
    modelGroup: 'anthropic'
  },
};

export default typeConfig;

export { defaultConfig, typeConfig };
