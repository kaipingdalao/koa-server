<template>
    <div id="Tan_table">
        <div class="table-border">
            <div class="table-box">
                <div class="t-header">
                    <table>
                        <thead>
                        <tr>
                            <th class="t-fixed-left" style="min-width: 170px;max-width: 170px">#</th>
                            <th
                                    v-for="(item, index) in t_header"
                                    :style="`min-width: ${item.width}px;
                                        max-width: ${item.width}px;
                                        left: ${colgroup_direction('left',index) ? width_sum.left(index) : 0}px;
                                        right: ${colgroup_direction('right',index) ? width_sum.right(index) : 0}px`"
                                    :class="[colgroup_direction('left',index) ? 't-fixed-left': '', colgroup_direction('right',index) ? 't-fixed-right' : '']"
                            >{{item.title}}
                            </th>
                        </tr>
                        </thead>
                    </table>
                </div>

                <table>
                    <tbody>
                    <tr v-for="(item, index) in props.t_body">
                        <td class="t-fixed-left" style="min-width: 170px;max-width: 170px">{{index + 1}}</td>
                        <td
                                v-for="(i,o) in t_header.length"
                                :class="[colgroup_direction('left',o) ? 't-fixed-left': '', colgroup_direction('right',o) ? 't-fixed-right' : '']"
                                :style="`min-width: ${t_header[o].width}px;
                                    max-width: ${t_header[o].width}px;
                                    left: ${colgroup_direction('left',o) ? width_sum.left(o): 0 }px;
                                    right: ${colgroup_direction('right',o) ? width_sum.right(o) : 0}px`"
                        >{{item[t_header[o].name]}}
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div class="page">
                <ul>
                    <li><</li>
                    <li>1</li>
                    <li>2</li>
                    <li>3</li>
                    <li>></li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import {onMounted, watch, reactive, toRefs} from 'vue'

    export default {
        name: "Tan_table",
        /**
         * t_header：    [{title: '显示的title', name: 'item对象的键', width: '100px'}, ...]
         * t_body：      [{key: 'value', ...}, ...]
         * options：     {fixed: {left: 0, right: 0}}
         **/
        props: {
            t_header: Array,
            t_body: Array,
            options: Object
        },

        setup(props, context) {
            var t_header = props.t_header
            var t_body = props.t_body
            var options = props.options
            // 索引栏宽为170px
            var index_width = 170

            /**
             * 通过列索引获取前或后列宽度总和
             * i:           int         0
             * return:      int         20
             **/
            let width_sum = {
                left: function (i) {
                    let sum = 0
                    t_header.forEach(function (item, index) {
                        if (index < i) sum += Number(item.width)
                    })
                    return sum + index_width
                },
                right: function (i) {
                    let sum = 0
                    t_header.forEach(function (item, index) {
                        if (index > i) sum += Number(item.width)
                    })
                    return sum
                }
            }

            /**
             * 判断是否列方向
             * direction:   str         'left' / 'right'
             * index:       int         0
             * return:      bool
             **/
            function colgroup_direction(direction,index) {
                if (direction == 'left') return index <= options.fixed.left-2
                return index > t_header.length - options.fixed.right - 1
            }

            return {
                t_header, t_body, options,
                width_sum,colgroup_direction,props
            }
        }
    }
</script>

<style scoped lang="less">
    #Tan_table {
        position: relative;
        width: inherit;
        height: inherit;
        /*z-index: 1;*/
        /*overflow-x: scroll;*/
        overflow: hidden;
        position: relative;

        .table-border {
            width: inherit;
            height: calc(100% - 50px);
            border: 1px #dcdee2 solid;
            border-bottom: 0px;
            padding: 10px;
            padding-bottom: 0px;
            background-color: #fff;
            margin: 10px;
            margin-bottom: 0px;
            border-radius: 6px;
        }

        .table-box {
            width: inherit;
            height: inherit;
            /*background-color: red;*/
            overflow-x: scroll;
            overflow-y: scroll;
            position: relative;
            border-radius: 6px;
        }

        table {
            background-color: #eb7350;
            margin: auto;

            tr {
                background-color: #F0F2F5;

                th, td {
                    width: 250px;
                    text-align: center;
                    box-sizing: border-box;
                    border-right: 1px solid #e8eaec;
                    border-left: 1px solid #e8eaec;
                    border-top: 1px solid #e8eaec;
                    border-bottom: 1px solid #e8eaec;
                    height: 48px;
                    line-height: 48px;
                    min-width: 220px;
                    max-width: 210px;
                    font-size: 14px;
                    font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, \\5FAE\8F6F\96C5\9ED1, Arial, sans-serif;
                    color: #515a6e;
                    -webkit-font-smoothing: antialiased;
                    pointer-events: auto;
                }

            }

            th {
                background-color: #f8f8f9;
            }

            td {
                background-color: #fff;
            }

            tr:hover td {
                transition: all 150ms linear 0s;
                background-color: #f3fbfe;
                background-color: #ebf7ff;
            }
        }

    }

    .t-header {
        position: sticky;
        top: 0px;
        z-index: 999;
    }

    .t-fixed-left {
        position: sticky;
        left: 0px;
        z-index: 998;
        background-color: #0092F9;
    }

    .t-fixed-right {
        position: sticky;
        right: 0px;
        z-index: 998;
        background-color: #0092F9;
    }

    .page {
        width: 100%;
        height: 50px;
        line-height: 50px;
        /*background-color: red;*/

        ul {
            margin: auto;
            display:flex;
            justify-content: center;
            /*background-color: red;*/
            margin-top: 10px;
            li {
                flex-direction: row;
                align-items: center;
                height: 17px;
                line-height: 17px;
                font-size: 15px;
                padding: 5px 9px;
                margin: 0px 5px;
                border: 1px #DADADA solid;
                border-radius: 7px;
            }
            li:hover {
                border: 1px #008EEA solid;
                color: #008EEA;
                cursor:pointer;
            }
        }
    }


</style>
