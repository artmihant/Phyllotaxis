
<template>
    <div class="top-control">
        <p><input type="range" style="width:90%" min="0" max="180" step="0.01" v-model="num_angle"></p>
        <p><input type="range" style="width:90%" min="1" max="2000" step="1" v-model="num_count"></p>
        <p>
            Угол: <input class="num" type="number"  min="0" max="180" step="0.01" v-model="num_angle"> |
            Зерен: <input class="num" type="number" v-model="num_count">
        </p>
    </div>
    <canvas class="canvas" ref="canvas" :width="size*2" :height="size*2"></canvas>
    <div class="bottom-control">

        <p >
            {{num_angle}}/360°
            <template v-for="spiral in spirals" >
                ≈<span @click="rank=rank===spiral[1]?null:spiral[1]" class="spiral" :class="{active:rank===spiral[1]}" >
                    {{spiral[0]}}/{{spiral[1]}}
                </span>
            </template>
        </p>
        <p>
            <span class="spiral" :class="{active:view_points}" @click="view_points = !view_points" >Зерна</span> |
            <span class="spiral" :class="{active:view_line}" @click="view_line = !view_line" >Спираль</span> |
            Ранг: <input class="num"  type="number" @change="draw" v-model="rank">
        </p>
    </div>
</template>

<script setup>
import {computed, onMounted, reactive, ref, watch} from "vue";
import {parast} from "./cfd.js";

let size = 180
let angle_grad = 137.5
let count = 1200

let num_count = ref(count)
let num_angle = ref(angle_grad)

let length_step = computed(() => Math.floor(size/(Math.sqrt(num_count.value))))
let radius = computed(() => Math.floor(size/(2*Math.sqrt(num_count.value))))
let spirals = computed(() => parast(Number(num_angle.value)/360))

let rank = ref(null)
let view_line = ref(true)
let view_points = ref(true)

/** @type {{value:HTMLCanvasElement}} */
let canvas = ref()

let draw = () => {
    const ctx = canvas.value.getContext('2d');
    let angle = num_angle.value
    let count = num_count.value

    let begin_color = [255,165,0]
    let end_color = [165,255,0]

    let points = []

    for(let i=0; i<count; i++){
        let r = length_step.value*Math.sqrt(count-i-1)
        let a = Math.PI*angle*i/180
        points.push([
            size + Math.round(r*Math.cos(a)),
            size + Math.round(r*Math.sin(a))
        ])
    }

    ctx.clearRect(0, 0, size*2, size*2);

    if (rank.value && view_line.value){
        ctx.strokeStyle = "rgb(255,165,0)";
        ctx.beginPath();
        points.forEach((point,i) => {if (i%rank.value === 0) ctx.lineTo(...point)})
        ctx.stroke();
    }

    if (view_points.value){

        for(let i=0; i<count; i++){
            let color = [
                Math.ceil((1-i/count)*begin_color[0] + i/count*end_color[0]),
                Math.ceil((1-i/count)*begin_color[1] + i/count*end_color[1]),
                Math.ceil((1-i/count)*begin_color[2] + i/count*end_color[2]),
            ]
            ctx.fillStyle = "rgb("+color[0]+","+color[1]+","+color[2]+")";
            if (i%rank.value === 0) {
                ctx.fillStyle = "white"
            }
            ctx.beginPath();
            ctx.arc(points[i][0],points[i][1], radius.value, 0, 2 * Math.PI, false);
            ctx.fill();
        }
    }
}


onMounted(()=>{
    requestAnimationFrame(function step() {
        draw()
        requestAnimationFrame(step)
    })
})


</script>

<style>
.top-control{
    top:0;
    left:0;
    width: 100vw;
    position: absolute;
}
.bottom-control{
    bottom:0;
    left:0;
    width: 100vw;
    position: absolute;
}

.spiral{
    border: 1px #472f28 solid;
    border-radius: 5px;
    margin-left:3px;
    margin-top:3px;
    cursor:pointer;
    background-color: #ffe445;
    color: #472f28;
    padding: 3px;
}
.spiral.active {
    color: #ffe445;
    background-color: #472f28;
}

.num{
    width: 70px !important;
}
</style>