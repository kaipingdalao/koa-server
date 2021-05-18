<template>
    <div class="calendar-header clear">
        <div class="calendar-box" v-if="props.headOptions.type == 'combination'">
            <div class="calendar-content" :style="{'text-align': headStyle.combination}">
                <span class="calendar-prev" @click="$emit('handlePrevMonth')"></span>
                <span class="calendar-headDate"> {{props.headOptions.date}} </span>
                <span class="calendar-next" @click="$emit('handleNextMonth')"></span>
            </div>
            <span class="calendar-today" @click="$emit('handleToday')"> 今天 </span>
        </div>
        <div class="calendar-box" v-else>
            <span class="calendar-headDate"> {{props.headOptions.date}} </span>
            <span class="calendar-today dispersion-today" :style="{float: headStyle.todayBtn}"
                  @click="$emit('handleToday')"> 今天 </span>
            <div class="calendar-content dispersion" :style="{float: headStyle.checkBtn}">
                <span class="calendar-prev" @click="handlePrevMonth"></span>
                <span class="calendar-next" @click="handleNextMonth"></span>
            </div>

        </div>
    </div>
</template>

<script>
    import {reactive, toRefs} from 'vue'

    export default {
        props: {
            headOptions: Object
        },
        setup(props, context) {
            const state = reactive({
                headStyle: ''
            })
            const {headStyle} = toRefs(state)
            state.headStyle = props.headOptions.style;

            // 上一个月
            const handlePrevMonth = function() {
                console.log('11111')
                context.emit("handlePrevMonth");
                // this.$emit('handlePrevMonth');
            }
            // 下一个月
            const handleNextMonth = () => {
                this.$emit('handleNextMonth');
            }
            // 回到今天
            const handleToday = () => {
                this.$emit('handleToday');
            }

            return {
                headStyle,props,
                handlePrevMonth, handleNextMonth, handleToday
            }
        }
    }
</script>

<style lang="less">
    .calendar-header {
        margin-bottom: 23px;
        width: 100%;

        .calendar-box {
            position: relative;
            height: 32px;
            line-height: 32px;

            .calendar-content {
                width: 100%;

                .calendar-prev,
                .calendar-next {
                    display: inline-block;
                    vertical-align: middle;
                    width: 8px;
                    height: 11px;
                    background: url('./assets/img/left.png') no-repeat;
                    background-size: contain;
                    cursor: pointer;
                }

                .calendar-next {
                    background: url('./assets/img/right.png') no-repeat;
                    background-size: contain;
                }
            }

            .dispersion {
                width: initial;
                display: inline;
            }

            .calendar-headDate {
                vertical-align: middle;
                margin: 0 12px;
                font-size: 18px;
                color: #424953;
                -webkit-user-select: none;
                -webkit-touch-callout: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
            }

            .calendar-today {
                position: absolute;
                top: 0;
                right: 0;
                width: 80px;
                height: 30px;
                text-align: center;
                border: 1px solid #2061FF;
                border-radius: 4px;
                font-size: 14px;
                color: #2061FF;
                cursor: pointer;
            }

            .dispersion-today {
                position: inherit;
            }

            .calendar-center {
                margin: 0 auto;
            }

            .calendar-left {
                float: left;
            }

            .calendar-right {
                float: right;
            }
        }
    }
</style>
