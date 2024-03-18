<template>
    <el-breadcrumb separator="/">
        <!--第一个面包屑默认首页-->
        <el-breadcrumb-item>
            <router-link to="/home">首页</router-link>
        </el-breadcrumb-item>
        <!--第二个取路由route的页面栈matched的最后一个-->
        <el-breadcrumb-item v-if="$route">
            {{ route }}
        </el-breadcrumb-item>
    </el-breadcrumb>
</template>


<script>
export default {
    name: "Breadcrumb",
    data() {
        return {

        }
    },

    computed: {
        route() {
            let matched = this.$route.matched;
            let len = matched.length;
            let { title } = matched[len - 1].meta;
            return title !== '首页' ? title : ''
        }
    },

    

}
</script>

<style></style>