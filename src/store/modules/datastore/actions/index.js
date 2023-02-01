import {
   getRaces,
} from "../../../../api";


export const getRacesAction = async (context) => {
//    context.commit("beginRequestUser");
   try {
       const response = await getRaces();
       if (response) context.commit("getRacesMutation", response);
    //    else context.commit("failRequestUser", 'Could not complete request!!');
   } catch (error) {
    //    context.commit("failRequestUser", error);
        console.error("Failed getting errors",error)
   }
};

