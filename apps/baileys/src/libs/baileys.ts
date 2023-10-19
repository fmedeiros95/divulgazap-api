import {
  AuthenticationCreds,
  AuthenticationState,
  BufferJSON,
  SignalDataTypeMap,
  initAuthCreds,
  proto,
} from '@whiskeysockets/baileys';
import { Device, DeviceDocument } from '../schemas';
import { DevicesService } from '../services';
import { Document, Model } from 'mongoose';

const KEY_MAP: { [T in keyof SignalDataTypeMap]: string } = {
  'pre-key': 'preKeys',
  session: 'sessions',
  'sender-key': 'senderKeys',
  'app-state-sync-key': 'appStateSyncKeys',
  'app-state-sync-version': 'appStateVersions',
  'sender-key-memory': 'senderKeyMemory',
};

type AuthState = {
  state: AuthenticationState;
  saveState: () => void;
};

export const authState = async (
  device: DeviceDocument,
  devicesService: DevicesService
): Promise<AuthState> => {
  let creds: AuthenticationCreds;
  let keys: any = {};

  device.$where

  const saveState = async () => {
    try {
      await devicesService.update(device._id, {
        session: JSON.stringify({ creds, keys }, BufferJSON.replacer, 0),
      });
    } catch (error) {
      console.log(error);
    }
  };

  if (device.session && device.session !== null) {
    const result = JSON.parse(device.session, BufferJSON.reviver);
    creds = result.creds;
    keys = result.keys;
  } else {
    creds = initAuthCreds();
    keys = {};
  }

  return {
    state: {
      creds,
      keys: {
        get: (type, ids) => {
          const key = KEY_MAP[type];
          return ids.reduce((dict: any, id) => {
            let value = keys[key]?.[id];
            if (value) {
              if (type === 'app-state-sync-key') {
                value = proto.Message.AppStateSyncKeyData.fromObject(value);
              }
              dict[id] = value;
            }
            return dict;
          }, {});
        },
        set: (data: any) => {
          for (const i in data) {
            const key = KEY_MAP[i as keyof SignalDataTypeMap];
            keys[key] = keys[key] || {};
            Object.assign(keys[key], data[i]);
          }
          saveState();
        },
      },
    },
    saveState,
  };
};
