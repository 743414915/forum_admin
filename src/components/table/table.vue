<template>
  <div>
    <el-table
      ref="dataTableRef"
      :data="dataSource.list || []"
      :height="tableHeight"
      :stripe="options.stripe"
      :border="options.border"
      highlight-current-row
      @row-click="handleRowClick"
      @selection-change="handleSelectionChange"
    >
      <!-- slelection选择框 -->
      <el-table-column
        v-if="options.selectType && options.selectType == 'checkbox'"
        type="selection"
        width="50"
        align="center"
      ></el-table-column>
      <!-- 数据列 -->
      <template v-for="(item, index) in columns" :key="item + index">
        <template v-if="item.scopedSlots">
          <el-table-column
            v-if="item.prop === 'serialNumber' ? options.showIndex : true"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :align="item.align || 'left'"
            :width="item.width"
          >
            <template #default="scope">
              <slot
                :name="item.scopedSlots"
                :index="scope.$index"
                :row="scope.row"
              ></slot>
            </template>
          </el-table-column>
        </template>
        <template v-else>
          <el-table-column
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :align="item.align || 'left'"
            :width="item.width"
            :fixed="item.fixed"
          ></el-table-column>
        </template>
      </template>
    </el-table>
    <!-- 分页 -->
    <div class="pagination" v-if="showPagination">
      <el-pagination
        v-if="dataSource.totalCount"
        background
        :total="dataSource.totalCount"
        :page-sizes="[15, 30, 50, 100]"
        :page-size="dataSource.pageSize"
        :current-page="dataSource.pageNo"
        layout="total,sizes,prev,pager,next,jumper"
        @size-change="handleSizeChange"
        @current-change="handlePageNoChange"
        style="text-align: right"
      >
      </el-pagination>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
const props = defineProps({
  dataSource: {
    type: Object,
    default: () => {},
  },
  // 是否展示分页
  showPagination: {
    type: Boolean,
    default: true,
  },
  // 表格属性
  options: {
    type: Object,
    default: {
      tableHeight: null,
      stripe: true,
      border: false,
      extHeight: 0,
      showIndex: true,
    },
  },
  // 数据列
  columns: {
    type: Array,
    default: () => [],
  },
  // 获取数据的函数
  fetch: {
    type: Function,
    default: () => {
      return null;
    },
  },
  initFetch: {
    type: Boolean,
    default: true,
  },
});

// 顶部60，内容区域距离顶部20，内容上下内间距15*2，分页区域高度46
const topHeight = 60 + 20 + 30 + 46;
const tableHeight = ref(
  props.options.tableHeight ||
    window.innerHeight - topHeight - (props.options.extHeight || 0)
);

// 初始化
const init = () => {
  if (props.initFetch && props.fetch) {
    props.fetch();
  }
};
init();

const dataTableRef = ref();
// 清除选中
const clearSelection = () => {
  dataTableRef.value.clearSelection();
};

// 设置行选中
const setCurrentRow = (rowKey, rowValue) => {
  let row = props.dataSource.list.find((item) => {
    return item[rowKey] === rowValue;
  });
  dataTableRef.value.setCurrentRow(row);
};
// 将子组件暴露出去，否则父组件无法调用
defineExpose({ setCurrentRow, clearSelection });
const emit = defineEmits(["rowSelected", "rowClick"]);
// 行点击
const handleRowClick = (row) => {
  emit("rowClick", row);
};

// 多选
const handleSelectionChange = (row) => {
  emit("rowSelected", row);
};

// 切换每页大小
const handlePageSizeChange = (size) => {
  props.dataSource.pageSize = size;
  props.dataSource.pageNo = 1;
  props.fetch && props.fetch();
};
// 切换页码
const handlePageNoChange = (pageNo) => {
  props.dataSource.pageNo = pageNo;
  props.fetch && props.fetch();
};
// 每页条数变化
const handleSizeChange = () => {};
</script>
<style lang="less" scoped>
.pagination {
  padding-top: 10px;
}
::v-deep(.el-pagination) {
  justify-content: right;
}
::v-deep(.el-table__body) {
  tr {
    &.current-row {
      > td.el-table__cell {
        background-color: #e6f0f9;
      }
    }
    &:hover {
      > td.el-table__cell {
        background-color: #e6f0f9 !important;
      }
    }
  }
}
</style>