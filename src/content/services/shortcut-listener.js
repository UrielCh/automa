import Mousetrap from 'mousetrap';
import browser from 'webextension-polyfill';
import { sendMessage } from '@/utils/message';

Mousetrap.prototype.stopCallback = function () {
  return false;
};

(async () => {
  try {
    const { shortcuts, workflows } = await browser.storage.local.get([
      'shortcuts',
      'workflows',
    ]);
    const shortcutsArr = Object.entries(shortcuts || {});

    if (shortcutsArr.length === 0) return;

    const keyboardShortcuts = shortcutsArr.reduce((acc, [id, value]) => {
      const workflow = workflows.find((item) => item.id === id);

      (acc[value] = acc[value] || []).push({
        id,
        workflow,
        activeInInput: workflow.trigger?.activeInInput || false,
      });

      return acc;
    }, {});

    Mousetrap.bind(Object.keys(keyboardShortcuts), ({ target }, command) => {
      const isInputElement =
        ['INPUT', 'SELECT', 'TEXTAREA'].includes(target.tagName) ||
        target?.contentEditable === 'true';

      keyboardShortcuts[command].forEach((item) => {
        if (!item.activeInInput && isInputElement) return;

        sendMessage('workflow:execute', item.workflow, 'background');
      });

      return true;
    });
  } catch (error) {
    console.error(error);
  }
})();
