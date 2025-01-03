<template>
	<cl-crud ref="Crud">
		<cl-row>
			<!-- 刷新按钮 -->
			<cl-refresh-btn />
			<!-- 新增按钮 -->
			<cl-add-btn />
			<!-- 删除按钮 -->
			<cl-multi-delete-btn />

			<cl-flex1 />
			<!-- 关键字搜索 -->
			<cl-search-key placeholder="搜索关键字" />
			<!-- 导入 -->
			<cl-import-btn template="/批量信息导入模板.xlsx" :on-submit="onSubmit" />

			<!-- 导出 -->
			 <cl-export-btn :columns="Table?.columns" />
		</cl-row>

		<cl-row>
			<!-- 数据表格 -->
			<cl-table ref="Table" />
		</cl-row>

		<cl-row>
			<cl-flex1 />
			<!-- 分页控件 -->
			<cl-pagination />
		</cl-row>

		<!-- 新增、编辑 -->
		<cl-upsert ref="Upsert" />
	</cl-crud>
</template>

<script lang="ts" name="information-info" setup>
import { useCrud, useTable, useUpsert } from "@cool-vue/crud";
import { useCool } from "/@/cool";
import { ElMessage } from 'element-plus';
import Json from "../../base/components/code/json.vue";

const { service } = useCool();

// cl-upsert
const Upsert = useUpsert({
	items: [
			{
				label: '录用时间',
				prop: 'date',
				component: {
					name: 'el-date-picker',
					props: { 
						type: 'date', 
						valueFormat: 'YYYY-MM-DD' 
					}
				},
				required: true
			},
			{
				label: '信息标题',
				prop: 'title',
				component: { 
					name: 'el-input', 
					props: { 
						clearable: true 
					} 
				},
				required: true
			},
			{
				label: '信息链接',
				prop: 'hypertext',
				component: { 
					name: 'el-input', 
					props: { 
						clearable: true 
					} 
				},
				required: true
			},
			{
				label: '报送单位',
				prop: 'reportUnit',
				component: { 
					name: 'el-input', 
					props: { 
						clearable: true 
					} 
				},
				required: true
			},
			{
				label: '录用单位',
				prop: 'hireUnit',
				component: { 
					name: 'el-input', 
					props: { 
						clearable: true 
					} 
				},
				required: true
			},
			{
				label: '录用栏目',
				prop: 'hireColumn',
				component: { 
					name: 'el-input', 
					props: { 
						clearable: true 
					} 
				},
				required: true
			},
			{
				label: '录用分数',
				prop: 'score',
				hook: 'number',
				component: { 
					name: 'el-input-number' 
				},
				required: true
			}
		]
});

// cl-table
const Table = useTable({
	columns: [
		{ type: "selection" },
		{ label: "录用时间", prop: "date" },
		{ label: "信息标题", prop: "title" },
		{ label: "信息链接", prop: "hypertext" },
		{ label: "报送单位", prop: "reportUnit" },
		{ label: "录用单位", prop: "hireUnit" },
		{ label: "录用单位", prop: "hireColumn" },
		{ label: "录用分值", prop: "score" },
		{ label: "创建时间", prop: "createTime", sortable: "desc" },
		{ label: "更新时间", prop: "updateTime" },
		{ type: "op", buttons: ["edit", "delete"] }
	]
});

// cl-crud
const Crud = useCrud(
	{
		service: service.information.info
	},
	(app) => {
		app.refresh();
	}
);

// 刷新
function refresh(params?: any) {
	Crud.value?.refresh(params);
}

// function onImpSubmit(data: { list: any[]; file: File }, { done, close }: any) {
// 	close();
// 	ElMessage.success(`已提交${data.list.length}条数据`);
// }
const columMapping = {
	录用时间:'date',
	信息标题:'title',
	信息链接:'hypertext',
	报送单位:'reportUnit',
	录用单位:'hireUnit',
	录用栏目:'hireColumn',
	录用分值:'score'
}
function onSubmit(data: any, { next, done, setProgress }) {
	//深拷贝data对象
	const data2 = JSON.parse(JSON.stringify(data));

	data.list = data2.list.map(item => {
		return  Object.keys(item).reduce((obj , key) => {
			const newKey = columMapping[key] || key;
			obj[newKey] = item[key];
			return obj;
		},{});
	});

	service.information.info.add(data.list).then(() => {
		console.log(data.list);
        ElMessage.success("导入成功");
        close();
      })
      .catch((err) => {
        ElMessage.error(err.message);
        done();
      });
  }
</script>
