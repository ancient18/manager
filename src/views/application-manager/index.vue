<template>
    <div id="application-manage">

        <el-row>
            <el-col :span="22">
                <!--这个属性接收名称，下面统一定义 -->
                <el-input placeholder="请输入名称" type="text" v-model="query"></el-input>
            </el-col>
            <el-col :span="2">
                <!-- 按钮事件也是下面统一定义 -->
                <el-button type="primary" @click="setQueryName">搜索</el-button>
            </el-col>
        </el-row>

        <!--tableData是表格数据-->
        <el-table :data="formattedTableData" id="gbox" :useIndex="true" :stripe="true" :border="true" :fit="true"
            :useMultiSelect="false">
            <!--第一列序号-->
            <el-table-column type="index" label="序号" width="55" align="center">
            </el-table-column>

            <el-table-column v-for="(col, index) in columns" :key="index" :label="col.label" :prop="col.prop"
                :width="col.width">
                <!-- 默认插槽  column是所有列信息，row是当前行信息-->
                <template v-slot="{ column, row }">
                    <div v-if="column.property === 'status'">
                        <el-tag :type="row[column.property] | statusColor">{{ row[column.property] | status }} </el-tag>

                    </div>
                    <!--如果是操作列添加三个按钮-->
                    <div v-else-if="column.property === 'opts'">
                        <el-button :disabled="[0, 2, 3, 6].indexOf(row['status']) === -1" @click="showEdit(row)"
                            type="primary">编辑</el-button>
                        <el-button @click="delLoan(row.id)" type="danger">删除</el-button>
                        <el-button :disabled="[0, 2, 3, 6].indexOf(row['status']) === -1" @click="submit(row.id)"
                            type="success">提交审核</el-button>
                    </div>

                    <div v-else>
                        {{ row[column.property] }}
                    </div>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination @current-change="handleCurrentChange" @size-change="updateSize" :page-sizes="[10, 20, 30, 40]"
            :page-size="pageOptions.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="rows">
        </el-pagination>

        <!--dialogVisible变量控制对话框是否显示-->
        <el-dialog title="申请管理-编辑" :visible="dialogVisible" @close="dialogVisible = false" width="30%">
            <div class="form-box">
                <el-form ref="updateForm" :model="updateForm" :rules="rules" label-width="80px">
                    <el-row>
                        <el-col :xl=20 :lg=20 :md=12 :sm=24 :xs=24>
                            <el-form-item label="姓名" prop="name">
                                <el-input type='input' v-model="updateForm.name"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :xl=20 :lg=20 :md=12 :sm=24 :xs=24>
                            <el-form-item label="性别" prop="sex">
                                <el-select v-model="updateForm.sex">
                                    <el-option key="man" label="男" value="man">
                                    </el-option>
                                    <el-option key="woman" label="女" value="woman">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>

                <div class="btns clear-fix">
                    <div>
                        <el-button type="primary" @click="submitUpdate">提交</el-button>
                        <el-button @click="cleanFrom">重置</el-button>
                    </div>
                </div>

            </div>
        </el-dialog>

    </div>
</template>

<script>

import { getLoanList, updateLoan, deleteLoan, submitApprove } from '@/apis/loan.js'
import { Notification } from 'element-ui'

export default {
    name: 'application-manage',
    filters: {
        statusColor(status) {
            const translations = {
                0: 'success',
                1: '',
                2: 'success',
                3: 'danger',
                4: 'success',
                5: 'success',
                6: 'danger',
                7: 'success'
            }

            return translations[status] || 'danger'
        },
        status(status) {
            const translations = {
                0: '进件',
                1: '提交初审',
                2: '初审通过',
                3: '初审拒绝',
                4: '提交终审',
                5: '终审通过',
                6: '终审拒绝',
                7: '生成合同'

            }
            return translations[status] || '未知'
        }

    },
    data() {
        return {
            rows: 0,
            query: '',
            tableData: [],
            pageOptions: {
                pageNo: 1,
                pageSize: 10
            },
            updateForm: {
                name: '',
                sex: '',
                id: 0
            },
            rules: {
                name: [{ required: true, message: '必须填写用户名' }],
                sex: [{ required: true, message: '必须填写性别' }],
            },
            dialogVisible: false,
            columns: [
                {
                    label: "姓名",
                    prop: "name",
                    width: "80",
                },
                {
                    label: "出生日期",
                    prop: "birthday",
                    width: "160",
                },
                {
                    label: "性别",
                    prop: "sex",
                },
                {
                    label: "教育程度",
                    prop: "education",
                },
                {
                    label: "居住地址",
                    prop: "address1",
                },
                {
                    label: "手机号",
                    prop: "mobile_phone",
                },
                {
                    label: "申请状态",
                    prop: "status",
                },
                {
                    label: "操作",
                    width: "280",
                    prop: "opts",
                },
            ],


        }
    },

    methods: {
        async setQueryName() {
            this.pageOptions.name = this.query;
            await this.getLoanList();
            this.pageOptions.name = null;
        },
        async getLoanList() {
            try {
                let res = await getLoanList(this.pageOptions)
                if (res.data.code === 20000) {
                    this.tableData = res.data.data.data.data;
                }
            } catch (error) {
                console.log(error);
                Notification.error({
                    title: '错误',
                    message: 数据错误
                })
            }

        },

        convertBirthday(date) {
            date = new Date(date)
            let year = date.getFullYear(), //获取完整的年份(4位)
                month = (date.getMonth() + 1).toString().padStart(2, '0'), //获取当前月份(0-11,0代表1月)
                strDate = date.getDate().toString().padStart(2, '0'), // 获取当前日(1-31)
                hours = date.getHours().toString().padStart(2, '0'),
                minutes = date.getMinutes().toString().padStart(2, '0'),
                seconds = date.getSeconds().toString().padStart(2, '0');
            return `${year}-${month}-${strDate} ${hours}:${minutes}:${seconds}`
        },

        getSex(str) {
            return str === "man" ? "男" : "女";
        },
        getEducation(str) {
            return str === "college" ? "大学" : "高中";
        },

        showEdit(row) {
            this.updateForm.id = row.id
            this.updateForm.name = row.name
            this.updateForm.sex = row.sex
            this.dialogVisible = true
        },

        async delLoan(id) {
            let res = await deleteLoan(id);
            if (res.data.code === 20000) {
                this.getLoanList()
            }
        },
        async submit(id) {
            let res = await submitApprove(id);
            if (res.data.code === 20000) {
                this.getLoanList()
            }
        },

        async submitUpdate() {
            let res = await updateLoan(this.updateForm)
            if (res.data.code === 20000) {
                this.cleanFrom()
                this.dialogVisible = false
                this.getLoanList()
            }
        },
        cleanFrom() {
            this.$refs["updateForm"].resetFields()
        },

        handleCurrentChange(pageNo) {
            this.pageOptions.pageNo = pageNo;
            this.getLoanList();
        },

        updateSize(size) {
            this.pageOptions.pageSize = size;
            this.getLoanList();
        }

    },

    computed: {
        formattedTableData() {
            return this.tableData.map(item => {
                item.birthday = this.convertBirthday(item.birthday);
                item.sex = this.getSex(item.sex);
                item.education = this.getEducation(item.education);
                return item;
            })
        }

    },

    mounted() {
        this.getLoanList()
    }
}
</script>

<style lang="scss" scoped>
.el-select,
.el-input {
    width: 100%;
}

.btns {
    text-align: center;
}

.box-card {
    margin-bottom: 10px;

    >div {
        >div {
            text-align: left;
        }
    }
}

.el-row {
    margin-bottom: 10px;
}

::v-deep .el-table--scrollable-x .el-table__body-wrapper {
    overflow-x: hidden;
}
</style>