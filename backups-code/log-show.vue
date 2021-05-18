<template>
    <div class="log-show">
        <msg>1111</msg><div>1111</div>
        <div class="date-picker">
            <date_picker
                    :options="calendarArr"
                    class="calendar"
                    @handleClickDay="handleClickDay"
                    @handlePrevMonth="handlePrevMonth"
                    @handleNextMonth="handleNextMonth"
                    @back_today="today_log"
            ></date_picker>
        </div>
        <div class="content-box">
            <div class="log-content" :class="{'log-content-open': !is_edit, 'log-content-close': is_edit}">
                <vue3-markdown-it class="markdown-css" :source="log_text" />
            </div>
            <div class="edit-textarea" :class="{'edit-textarea-open': is_edit, 'edit-textarea-close': !is_edit}">
                <textarea v-show="is_edit" v-model="log_text"></textarea>
            </div>
            <div class="edit-switch">
                <button @click="up_data">{{is_edit ? 'submit' : 'edit'}}</button>
            </div>
        </div>
    </div>
</template>

<script>
    import date_picker from '/src/components/common/vue3-date-picker/date-picker.vue'
    import {reactive, toRefs, computed, onMounted} from 'vue'
    import http from '/src/lib/http'
    import {date_for_timestamp, timestamp_for_start_end} from '/src/lib/custom'
    import "/src/components/common/css/markdown.less"
    import 'highlight.js/styles/github-gist.css';
    import msg from '/src/components/common/Message.vue'

    export default {
        name: "show",
        components: {
            date_picker,msg
        },
        setup() {
            const state = reactive({
                // 日历选项
                calendarArr: {
                    type: 'combination',
                    headStyle: {
                        todayBtn: 'right',
                        combination: 'center',
                        checkBtn: 'right',
                    },
                    viewStyle: {
                        day: 'right'
                    },
                    calendarData: []
                },
                // 编辑状态
                is_edit: false,
                // log内容
                log_text: ''
            })
            const {calendarArr, is_edit, log_text} = toRefs(state)


            // 获取数据
            const get_log = (timestamp_start, timestamp_end) => {
                http('get', '/log/get_log', {
                    timestamp_start: timestamp_start,
                    timestamp_end: timestamp_end
                }).then(res => {
                    state.log_text = res.data.content
                })
            }

            // 加载今天笔记
            const today_log = () => {
                // 今天的开始结束时间戳
                const today_timestamp_start = timestamp_for_start_end(Number(new Date().getTime())).timestamp_start
                const today_timestamp_end = timestamp_for_start_end(Number(new Date().getTime())).timestamp_end
                get_log(today_timestamp_start, today_timestamp_end)
            }

            // 提交编辑
            const up_data = () => {
                state.is_edit = !state.is_edit
                console.log(state.is_edit)
            }

            // 点击日期
            const handleClickDay = (date) => {
                const {year, month, day} = date
                const timestamp_start = date_for_timestamp(year, month, day)
                const timestamp_end = date_for_timestamp(year, month, day + 1) - 1
                get_log(timestamp_start, timestamp_end)
            }
            // 点击上月
            const handlePrevMonth = () => {
            }
            // 点击下月
            const handleNextMonth = () => {
            }


            onMounted(() => {
                today_log()
            })

            return {
                calendarArr, is_edit,
                handleClickDay, handlePrevMonth, handleNextMonth,today_log,
                up_data, log_text
            }
        }
    }
</script>

<style scoped lang="less">
    @edit-textarea-height: 350px;
    @edit-switch-height: 60px;

    .log-show {
        /*background-color: red;*/
        overflow-y: scroll;
        width: inherit;
        height: inherit;
        display: flex;
        justify-content: flex-start;
    }

    .date-picker {
        width: 40%;
        overflow-y: scroll;
    }

    .date-picker::-webkit-scrollbar {
        display: none;
    }

    .content-box {
        width: 60%;

        .edit-textarea {
            transition: all 250ms linear 0s;

            textarea {
                paddding: 15px;
                margin: 0px;
                max-width: 100%;
                max-height: 100%;
                min-width: 100%;
                min-height: 100%;
                border-radius: 8px;
                border: 1px #cccccc solid;

                font-size: 13px;
                box-sizing:border-box;
                padding: 15px;
            }
        }

        .edit-textarea-open {
            height: calc(@edit-textarea-height - @edit-switch-height);
        }

        .edit-textarea-close {
            height: 0px;
        }

        .log-content {
            width: 100%;
            /*background-color: green;*/
            overflow-y: scroll;
            transition: all 250ms linear 0s;
        }

        .log-content-open {
            margin-bottom: 0px;
            height: calc(100% - 60px);
        }

        .log-content-close {
            margin-bottom: 20px;
            height: calc(100% - @edit-textarea-height - 20px);
        }

        .edit-switch {
            position: absolute;
            bottom: 0px;
            right: 0px;
            height: @edit-switch-height;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            /*background-color: red;*/

            button {
                height: 30px;
                margin: 0px 60px;
                padding: 0px 10px;

                text-align: center;
                border: 1px solid #2061FF;
                border-radius: 4px;
                font-size: 14px;
                color: #2061FF;
                cursor: pointer;
            }
        }
    }

    /*.content-box::-webkit-scrollbar {*/
    /*    width: 16px; !*滚动条宽度*!*/
    /*    !*height: 16px;  !*滚动条高度*!*!*/
    /*}*/
</style>
