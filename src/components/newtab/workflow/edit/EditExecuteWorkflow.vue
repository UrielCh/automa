<template>
  <div>
    <ui-select
      :model-value="data.workflowId"
      :placeholder="t('workflow.blocks.execute-workflow.select')"
      class="w-full mb-4"
      @change="updateData({ workflowId: $event })"
    >
      <option
        v-for="workflow in workflows"
        :key="workflow.id"
        :value="workflow.id"
      >
        {{ workflow.name }}
      </option>
    </ui-select>
    <ui-input
      :model-value="data.executeId"
      :placeholder="t('workflow.blocks.execute-workflow.executeId')"
      :title="t('workflow.blocks.execute-workflow.executeId')"
      class="mb-2 w-full"
      @change="updateData({ executeId: $event })"
    />
    <p>{{ t('common.globalData') }}</p>
    <pre
      v-if="!state.showGlobalData"
      class="rounded-lg text-gray-200 p-4 max-h-80 bg-gray-900 overflow-auto"
      @click="state.showGlobalData = true"
      v-text="data.globalData"
    />
    <ui-modal
      v-model="state.showGlobalData"
      title="Global data"
      content-class="max-w-xl"
    >
      <p>{{ t('workflow.blocks.execute-workflow.overwriteNote') }}</p>
      <shared-codemirror
        :model-value="data.globalData"
        lang="json"
        class="w-full scroll"
        style="height: calc(100vh - 10rem)"
        @change="updateData({ globalData: $event })"
      />
    </ui-modal>
  </div>
</template>
<script setup>
import { computed, shallowReactive, defineAsyncComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import Workflow from '@/models/workflow';

const SharedCodemirror = defineAsyncComponent(() =>
  import('@/components/newtab/shared/SharedCodemirror.vue')
);

const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
  hideBase: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(['update:data']);

const { t } = useI18n();
const route = useRoute();

const state = shallowReactive({
  showGlobalData: false,
});

const workflows = computed(() =>
  Workflow.query()
    .where(
      ({ id, drawflow }) =>
        id !== route.params.id && !drawflow.includes(route.params.id)
    )
    .orderBy('name', 'asc')
    .get()
);

function updateData(value) {
  emit('update:data', { ...props.data, ...value });
}
</script>
