
<script lang="ts" setup>
  import { reactive,ref,toRefs,toRef } from 'vue';
  import Draggable from 'vuedraggable';
  //import { computed, defineComponent } from "vue";
  import {WalletConnect} from "../../composables/tronlink";
  
  import contractData from "../../../../contracts/artifacts/contracts/Main.sol/UnityTernimal.json";
  import { createTronInstance,createContractInstance } from "../../composables/contractsMethod";
  import { useMessage } from 'naive-ui';
//0x70a8c885dE8697b20209A8B06Ca9c8EDd513dC61
  const message = useMessage();
  const showModelController = ref(false);
  const addressInput = ref("TYPtFkyZiomE82UmHZqAdG1tvXMR7z3ZHf");
  const addressUSDTInput = ref("TXLAQ63Xg1NAzckPwKHvzw7CSEmLMEqcdj");
  const getContractInstance = ref(false);
  /*钱包状态 */
  const walletData = reactive({data:{address:"TUeZ2fREiiGwLpAgZxd9H8NEsYqj8L8DKX",state:""}});

  const contractBtns = reactive([
      { cname: '连接钱包', cid: 1,btnClicked:false},
      { cname: '连接合约', cid: 2,btnClicked:false},
      { cname: '查看合约U币余额', cid: 3,btnClicked:false,cvalue:0},
    ]);
  
  const abiFuncLists =reactive({data:[]});

  const onPositiveClick = () =>{
    showModelController.value = !showModelController.value 
  }
  const contractBtn =async (itemId)=>{
    if(itemId === 1 && !walletData.data.state) {
      walletData.data=await WalletConnect();
      if(walletData.data.state){
        contractBtns[0].btnClicked = true
      }
    }
    if(itemId === 2) {
      connectContractBtn()
    }

    if(itemId === 3) {
      const tronWeb   =await createTronInstance();
      tronWeb.setAddress(walletData.data.address);
      const instance  =await tronWeb.contract().at(addressUSDTInput.value);
      contractBtns[2].cvalue =await instance.balanceOf(addressInput.value).call();
      console.log("查看余额", contractBtns[2].cvalue)
    }

  }
  /**连接合约 */ 
  const connectContractBtn = async()=>{
    if(!walletData.data.state) {
      message.error("请先连接钱包");
     // return ;
    }
    const {tronWebInstance,tronWebAbiList}= await createContractInstance(addressInput.value,walletData.data.address);
    getContractInstance.value = true

    
    let contractDataArr = []
    tronWebAbiList.forEach(it=>{
      console.log("length",it.inputs)
        it.inputsLength = false;
      if(undefined != it.inputs &&it.inputs.length>0 ){
         it.inputsLength = true;
      }
      let itjson = {...it,cvalue:""}
      contractDataArr.push(itjson)
    })
    console.log("contractDataArr",contractDataArr)
    abiFuncLists.data = contractDataArr
  }

  
  /**end */
  const showElementClickContent = ref()

  /**合约方法 */
  const showContractModel = ref(false)
  const contractModelTitle = ref("")
  const contractModelContent = ref("")
  const elementClick = async (element) =>{
    if(!getContractInstance.value) {
      console.log("请先连接合约");
      showModelController.value = true
      return ;
    }
    showElementClickContent.value = element



    try{
      let result ;
      let inputsArr = [];
      if(element.inputs.length > 0){       
        element.inputs.forEach(items => { 
          if(items.cvalue)        
            inputsArr.push(items.cvalue)
          else{
            message.error("请输入参数")
          }
        })
      }

      // if(element.inputs.length === 1)
      //   result = await connect[element.name](inputsArr[0])
      // else if(element.inputs.length === 2)
      //   result = await connect[element.name](inputsArr[0],inputsArr[1])
      // else if(element.inputs.length === 3)
      //   result = await connect[element.name](inputsArr[0],inputsArr[1],inputsArr[2])
      // else
      //   result = await connect[element.name]()

      // element.cvalue = result
      console.log("调用方法:",element.name,"参数:",inputsArr)
     
      message.success("调用成功")
    } catch (err){
      contractModelTitle.value = "合约方法"+element.name+"调用错误";
      contractModelContent.value = err.toString()
      showContractModel.value = true
      console.log("err",err.toString())
    } 
  }
  const onPositiveClickContract = () =>{
    showContractModel.value = !showContractModel.value 
  }
  //连接合约
 
  /** */

</script>
<template>
  <div>

    <n-modal     
    v-model:show="showModelController"
    :mask-closable="false"
    preset="dialog"
    title="提示"
    content="请先连接合约"
    positive-text="确认"
    @positive-click="onPositiveClick"
    >
    </n-modal>

    <n-modal     
    v-model:show="showContractModel"
    :mask-closable="false"
    preset="dialog"
    :title="contractModelTitle"
    :content="contractModelContent"
    positive-text="确认"
    @positive-click="onPositiveClickContract"
    >
    </n-modal>

    <div class="n-layout-page-header">
      <n-card title="设置合约地址">
        <n-input-group>          
          <n-input :style="{ width: '30%' }" v-model:value="addressInput" />
          <n-button type="primary">设置</n-button>
        </n-input-group>
      </n-card> 
      <n-card title="设置USDT合约地址">
        <n-input-group>          
          <n-input :style="{ width: '30%' }" v-model:value="addressUSDTInput" />
          <n-button type="primary">设置</n-button>
        </n-input-group>       
       </n-card>      
    </div>

    <n-grid
      cols="1 s:2 m:3 l:3 xl:3 2xl:3"
      class="mt-4 proCard"
      responsive="screen"
      :x-gap="12"
      :y-gap="8"
    >
      <n-grid-item>
        <NCard
          title="合约方法"
          :segmented="{ content: true, footer: true }"
          size="small"
          :bordered="false"
        >  
          <!--合约按钮部分-->
          <Draggable
            class="draggable-ul"
            animation="300"
            :list="contractBtns"          
            itemKey="cname"
          >
            <template #item="{ element }">
              <div class="cursor-move draggable-li">
                <n-button type="info" @click="()=>contractBtn(element.cid)" :disabled="element.btnClicked">
                    {{ element.cname }}
                </n-button>   
                <p v-if="element.cvalue">USDT余额:{{element.cvalue}}</p>             
              </div>
            </template>
          </Draggable>
        </NCard>
      </n-grid-item>

      <n-grid-item>
        <NCard
          title="Abi方法"
          :segmented="{ content: true, footer: true }"
          size="small"
          :bordered="false"
        >
        <Draggable
            class="draggable-ul"
            animation="300"
            :list="abiFuncLists.data"          
            itemKey="name"
          >
            <template #item="{ element }" >
              
              <div v-if="element.name && element.stateMutability"  class="cursor-move draggable-li">
                    <div>
                      <n-button type="info" @click="()=>elementClick(element)">{{ element.name }}</n-button>
                      &nbsp;                 
                      <n-tag type="warning">{{element.stateMutability}}</n-tag> 
                      &nbsp;&nbsp;
                      <n-tag v-if="element.cvalue" type="info">{{element.cvalue}}</n-tag> 
                    </div>
                    <div v-if="element.inputsLength" class="draggable-fixed">
                      <div v-for="(item,indexs) in element.inputs" :key="indexs">
                        <n-input-group>
                          <n-input-group-label>{{item.name}}</n-input-group-label>
                          <n-input v-model:value="item.cvalue" type="text" :placeholder="(item.type)" />                         
                        </n-input-group>                        
                      </div> 
                    </div>
              </div>
            </template>
          </Draggable>
        </NCard>
      </n-grid-item>

      <n-grid-item>
        <NCard
          title="点击合约方法数据"
          :segmented="{ content: true, footer: true }"
          size="small"
          :bordered="false"
        >
        <div class="cursor-move draggable-li"> 
              <span class="ml-2">{{showElementClickContent}}</span>
        </div>
        </NCard>
      </n-grid-item>      
    </n-grid>
  </div>
</template>
<style lang="less" scoped>
  .draggable-ul {
    width: 100%;
    overflow: hidden;
    margin-top: -16px;

    .draggable-li {
      width: 100%;
      padding: 16px 10px;
      color: #333;
      border-bottom: 1px solid #efeff5;
    }
  }
  .draggable-fixed{
    width: 80%;
  }
</style>
