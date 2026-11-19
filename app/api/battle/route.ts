import {resolveTurn,type BattleState,type Action} from '../../../lib/battle';
export async function POST(request:Request){
  try{if(Number(request.headers.get('content-length'))>4096)return Response.json({error:'요청이 너무 큽니다.'},{status:413}); const {state,action}=await request.json() as {state:BattleState;action:Action};return Response.json(resolveTurn(state,action));}
  catch(error){return Response.json({error:error instanceof Error?error.message:'전투 요청에 실패했습니다.'},{status:400});}
}
