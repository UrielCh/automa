<template>
  <div>
    <ui-button
      :disabled="conditions.length >= 10"
      variant="accent"
      class="mb-4"
      @click="addCondition"
    >
      {{ t('workflow.blocks.conditions.add') }}
    </ui-button>
    <ul class="space-y-2">
      <li
        v-for="(condition, index) in conditions"
        :key="index"
        class="relative rounded-lg bg-input transition-colors group"
      >
        <input
          v-model="condition.compareValue"
          type="text"
          placeholder="value"
          class="py-2 px-4 w-full transition rounded-lg bg-transparent"
        />
        <button
          class="bg-white absolute top-1/2 right-4 p-2 rounded-lg -translate-y-1/2 group-hover:right-14"
          @click="deleteCondition(index)"
        >
          <v-remixicon size="20" name="riDeleteBin7Line" />
        </button>
        <select
          v-model="condition.type"
          :title="getTitle(index)"
          class="bg-white absolute right-4 font-mono z-10 p-2 top-1/2 leading-tight -translate-y-1/2 text-center transition rounded-lg appearance-none"
        >
          <option
            v-for="(name, type) in conditionTypes"
            :key="type"
            :value="type"
          >
            {{ type }}
          </option>
        </select>
        <div
          class="w-full bg-gray-300 h-px mx-auto"
          style="max-width: 89%"
        ></div>
        <input
          v-model="condition.value"
          type="text"
          placeholder="value"
          class="py-2 px-4 w-full transition rounded-lg bg-transparent"
        />
      </li>
    </ul>
  </div>
</template>
<script setup>
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import emitter from '@/lib/mitt';

const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
  blockId: {
    type: String,
    default: '',
  },
});
const emit = defineEmits(['update:data']);

const conditionTypes = {
  '==': 'equals',
  '!=': 'ne',
  '>': 'gt',
  '>=': 'gte',
  '<': 'lt',
  '<=': 'lte',
  '()': 'contains',
};
const { t } = useI18n();

const conditions = ref(props.data.conditions);

function getTitle(index) {
  const type = conditionTypes[conditions.value[index]?.type] || 'equals';

  return t(`workflow.blocks.conditions.${type}`);
}
function addCondition() {
  if (conditions.value.length >= 10) return;

  emitter.emit('conditions-block:add', {
    id: props.blockId,
  });

  conditions.value.unshift({
    compareValue: '',
    value: '',
    type: '==',
  });
}
function deleteCondition(index) {
  conditions.value.splice(index, 1);

  emitter.emit('conditions-block:delete', {
    index,
    id: props.blockId,
  });
}

watch(
  conditions,
  () => {
    emit('update:data', {
      conditions: conditions.value,
    });
  },
  { deep: true }
);
</script>
