/**
 * Type definitions for deneric
 * Project: deneric
 * Definitions by: QuangNPD <quangnpd@gmail.com>
 */
 declare namespace deneric {
    const String: string;
    const Number: number;
    const Boolean: boolean;
    const Array: Array<any>;
    const Object: object;
    const Any: any;
  
    class Entity {
      constructor(data: object, mapping: object);
      private __mapping: object;
      protected set _mapping(mapping: object);
      protected get _mapping(): object;
      protected _parsingData(data: object, mapping?: object): void;
      public get serialize(): object;
      public get deserialize(): object;
    }
  
    function parseValue(value: any, dataType: any, defaultValue?: any, parser?: Function, validate?: Function): any;
    function selectValue(value: any, dataType: any, defaultValue?: any, parser?: Function, validate?: Function): any;
    function getValue(dataType: any, value: any, defaultValue?: any, validate?: Function): any;
  }