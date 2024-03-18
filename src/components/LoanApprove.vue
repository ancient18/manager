<template>
    <div id="input-manager">
        <el-row>
            <el-col :span="22">
                <el-input placeholder="请输入名称" type="text" v-model="query"></el-input>
            </el-col>
            <el-col :span="2">
                <!-- 按钮 -->
                <el-button type="primary" @click="setQueryName">搜索</el-button>
            </el-col>
        </el-row>

        <el-table :data="formattedTableData" id="gbox" :useIndex="true" :stripe="true" :border="true" :fit="true"
            :useMultiSelect="false">
            <el-table-column type="index" label="序号" width="55" align="center">
            </el-table-column>
            <el-table-column v-for="(col, index) in columns" :key="index" :label="col.label" :prop="col.prop"
                :width="col.width">
                <!--插槽，如果当前列是操作，添加三个按钮-->
                <template v-slot="{ column, row }">
                    <div v-if="column.property === 'opts'">
                        <el-button @click="showInfo(row)" type="primary">查看</el-button>
                        <!-- 传入pass和reject代表调用通过或者拒绝接口-->
                        <el-button @click="submit(row.id, 'pass')" type="success">通过</el-button>
                        <el-button @click="submit(row.id, 'reject')" type="danger">拒绝</el-button>
                    </div>
                    <div v-else>
                        {{ row[column.property] }}
                    </div>
                </template>

            </el-table-column>

        </el-table>

        <el-dialog title="贷款审批-查看详情" :visible="dialogVisible" @close="dialogVisible = false" width="30%">
            <div class="form-box" v-if="dialogVisible">
                <el-form ref="form" :model="form" label-width="80px">
                    <el-row>
                        <el-col v-for="(value, key) in form" :key="key">
                            <el-form-item :label="key | changePropToLabel" :prop="key">
                                <el-input type='input' v-model="form[key]" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>

                <div class="btns clear-fix">
                    <div>
                        <el-button type="primary" @click="dialogVisible = !dialogVisible">取消</el-button>

                    </div>
                </div>
            </div>
        </el-dialog>

        <el-pagination @current-change="handleCurrentChange" @size-change="updateSize" :page-sizes="[10, 20, 30, 40]"
            :page-size="pageOptions.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="rows">
        </el-pagination>
    </div>
</template>

<script>

import { queryList, approve } from "@/apis/loan.js";
import { Notification } from "element-ui";

export default {
    props: {
        name: {
            type: String,
        }
    },

    filters: {
        changePropToLabel(prop) {
            const translations = {
                "id": 'id',
                "name": '姓名',
                "birthday": '出生日期',
                "sex": '性别',
                "education": '教育程度',
                "address1": '地址',
                "phone": '手机号',
                "identity_card": '身份证'
            };


            return translations[prop] || prop; // 如果找不到对应的翻译，返回原属性名
        }
    }
    ,
    data() {
        return {
            query: '',
            rows: 0,
            rawTableData: [],
            pageOptions: {
                pageNo: 1,
                pageSize: 10
            },
            form: {
                id: 0,
                name: '',
                birthday: '',
                sex: '',
                education: '',
                address1: '',
                phone: '',
                identity_card: '',
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
                    label: "身份证",
                    prop: "identity_card",
                    width: "260",
                },
                {
                    label: "操作",
                    // width: "280",
                    prop: "opts",
                },
            ],
        }
    },
    methods: {
        async setQueryName() {
            this.pageOptions.name = this.query
            await this.getFirstList()
            this.pageOptions.name = null
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

        async getFirstList() {
            console.log("methods");
            try {
                const res = await queryList(this.name, this.pageOptions);
                if (res.data.code === 20000) {
                    this.rawTableData = res.data.data.data.data;
                    this.rows = res.data.data.rows;
                }
            }
            catch (error) {
                console.log(error);
                Notification.error({
                    title: '错误',
                    message: '数据错误'
                })
            }


        },

        showInfo(row) {
            console.log(row);
            console.log(this.form);
            Object.keys(this.form).forEach(key => { this.form[key] = row[key] })
            console.log(this.form);
            this.dialogVisible = true
        },

        // 审批
        async submit(id, flag) {
            let res = await approve(this.name, id, flag);
            if (res.data.code === 20000) {
                this.getFirstList();
            }
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
        // 计算属性用于格式化日期
        formattedTableData() {
            console.log("computed");
            return this.rawTableData.map(item => ({
                ...item,
                birthday: this.convertBirthday(item.birthday)
            }));
        },
    },

    mounted() {
        console.log("mounted");
        this.getFirstList();
        console.log("mounted1");
    },
}


</script>

<style lang="scss" scoped>
::v-deep .el-table--scrollable-x .el-table__body-wrapper {
    overflow-x: hidden;
}

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
</style>