$( document ).ready(function() {
	 $(function () {
        $('#element')
                .bootstrapDualListbox({
                    bootstrap2Compatible: false,
                    moveAllLabel: 'MOVE ALL',
                    removeAllLabel: 'REMOVE ALL',
                    moveSelectedLabel: 'MOVE SELECTED',
                    removeSelectedLabel: 'REMOVE SELECTED',
                    filterPlaceHolder: 'FILTER',
                    filterSelected: '2',
                    filterNonSelected: '1',
                    moveOnSelect: false,
                    preserveSelectionOnMove: 'all',
                    helperSelectNamePostfix: '_myhelper',
                    selectedListLabel: 'Selected elements',
                    nonSelectedListLabel: 'Unselected elements'
                })
                .bootstrapDualListbox('setMoveAllLabel', 'Move all teh elementz!!!')
                .bootstrapDualListbox('setRemoveAllLabel', 'Remove them all!')
                .bootstrapDualListbox('setSelectedFilter', undefined)
                .bootstrapDualListbox('setNonSelectedFilter', undefined)
                .append('<option>added element</option>')
                .bootstrapDualListbox('refresh')
    });

});
