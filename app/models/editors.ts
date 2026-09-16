export type EditorId = 'vscode' | 'zed';

export type SectionId =
  | 'activityBar'
  | 'errors'
  | 'versionControl'
  | 'aiChat'
  | 'extensions'
  | 'editorWidgets'
  | 'statusBar';

export type BadgeKind = 'version' | 'rating' | 'installs' | 'downloads';

export type Distribution = {
  id: string;
  name: string;
  url: string;
  badgeProvider?: 'marketplace' | 'openvsx';
  badges: BadgeKind[];
};

export type EditorTheme = {
  id: EditorId;
  label: string;
  subtitle: string;
  description: string;
  distributions: Distribution[];
  sections: SectionId[];
};

export const editorRegistry = {
  vscode: {
    id: 'vscode',
    label: 'VSCode',
    subtitle: 'VSCode Theme',
    description: 'Tlah-PAH-lee theme for Visual Studio Code.',
    distributions: [
      {
        id: 'marketplace',
        name: 'VSCode Marketplace',
        url: 'https://marketplace.visualstudio.com/items?itemName=ackzell.tlapalli',
        badgeProvider: 'marketplace' as const,
        badges: ['version', 'rating', 'installs', 'downloads'],
      },
      {
        id: 'openvsx',
        name: 'Open VSX',
        url: 'https://open-vsx.org/extension/ackzell/tlapalli',
        badgeProvider: 'openvsx' as const,
        badges: ['version', 'downloads', 'rating'],
      },
    ],
    sections: [
      'errors',
      'versionControl',
      'aiChat',
      'extensions',
      'editorWidgets',
      'statusBar',
      'activityBar',
    ],
  },
  zed: {
    id: 'zed',
    label: 'Zed',
    subtitle: 'Zed Theme',
    description: 'Tlah-PAH-lee theme for Zed.',
    distributions: [
      {
        id: 'zed-extension',
        name: 'Zed Extensions',
        url: 'https://zed.dev/extensions/tlapalli-theme',
        badges: [],
      },
    ],
    sections: [],
  },
} as const satisfies Record<EditorId, EditorTheme>;

export type EditorThemeRecord = typeof editorRegistry;

export const editorList = Object.values(editorRegistry) as EditorTheme[];
